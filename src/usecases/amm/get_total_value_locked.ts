import { Result, UseCase, right, left, isAddressString } from '~/shared/core'
import { response } from '.'
import { request } from 'graphql-request'
import { ChainId, Token } from '@latteswap/sdk'
import { formatEther, parseEther } from '@ethersproject/units'
import { BigNumber } from 'ethers'
import { IAlpacaAdapter } from '~/infra/adapters/contract/alpaca/types'
import { wrapErr } from '~/utils/wrapErr'
import { ERC20, LatteSwapPair } from '@latteswap/latteswap-contract/typechain'
import { Pair as PancakePair } from '@pancakeswap/sdk'

import {
  ALPACA,
  BSC_NETWORK_CHAIN_ID,
  BUSD,
  IBALPACA,
  OG_OWNER_TOKENS,
  WHITELIST_PCS_POOLS,
  ZERO,
} from '~/constants'
import { pairSubsetQuery, poolsQuery } from '~/infra/graphql/quries'
import config, {
  IPairFieldsDTO,
  IPairSubsetQueryResultDTO,
  IPoolsQueryResultDTO,
  IPoolsQueryResultFieldsDTO,
} from '~/infra/config'

export const getPoolToken = async (
  poolTokenContract: ERC20,
  chainId: ChainId,
  poolAddress: string,
): Promise<Token> => {
  const [symbol, name, decimals] = await Promise.all([
    poolTokenContract.symbol(),
    poolTokenContract.name(),
    poolTokenContract.decimals(),
  ])
  if (symbol.toUpperCase() === 'CAKE') {
    return new Token(
      chainId as ChainId,
      isAddressString(poolAddress),
      decimals,
      symbol.toUpperCase(),
      name,
    )
  }
  return new Token(
    chainId as ChainId,
    isAddressString(poolAddress),
    decimals,
    symbol,
    name,
  )
}

const masterBaristaGraph = config.get('masterBaristaGraph') 
const exchangeGraph = config.get('exchangeGraph') 

export async function processLiquidityPool(
  pool: IPoolsQueryResultFieldsDTO,
  pair: IPairFieldsDTO,
): Promise<BigNumber> {
  if (
    parseEther(Number(pair.reserveUSD).toFixed(18)).isZero() ||
    parseEther(Number(pair.totalSupply).toFixed(18)).isZero()
  ) {
    return ZERO
  }
  return BigNumber.from(pool.balance)
    .mul(parseEther(Number(pair.reserveUSD).toFixed(18)))
    .div(parseEther(Number(pair.totalSupply).toFixed(18)))
}

export const singleAssetTotalPoolValue = async (
  poolToken: Token,
  pairContractFactory: (pairAddress?: string) => LatteSwapPair | null,
  poolBalance: BigNumber,
): Promise<BigNumber> => {
  let totalPoolValue = BigNumber.from(0)
  if (poolToken.equals(BUSD)) {
    totalPoolValue = poolBalance
  } else {
    const lpPairAddress = PancakePair.getAddress(poolToken, BUSD) // use pancake pair as of now
    const maybePairContract = pairContractFactory(lpPairAddress)
    if (maybePairContract) {
      const reservesErr = await wrapErr(maybePairContract.getReserves())
      if (reservesErr.isRight()) {
        const [reserve0, reserve1] = reservesErr.value as [
          BigNumber,
          BigNumber,
          number,
        ]
        if (!reserve0.isZero() || !reserve1.isZero()) {
          const totalPoolValueNumerator = poolToken.sortsBefore(BUSD)
            ? reserve1.mul(poolBalance).mul(BUSD.decimals)
            : reserve0.mul(poolBalance).mul(poolToken.decimals)
          const totalPoolValueDenominator = poolToken.sortsBefore(BUSD)
            ? reserve0.mul(poolToken.decimals)
            : reserve1.mul(BUSD.decimals)
          totalPoolValue = totalPoolValueNumerator.div(
            totalPoolValueDenominator,
          )
        }
      }
    }
  }

  return totalPoolValue
}

export const processSingleAsset = async (
  pool: IPoolsQueryResultFieldsDTO,
  poolTokenContract: ERC20,
  alpacaVaultContract: IAlpacaAdapter,
  pairContractFactory: (
    pairAddress?: string | undefined,
  ) => LatteSwapPair | null,
): Promise<BigNumber> => {
  const eitherSymbolOrErr = await wrapErr(poolTokenContract.symbol())
  if (eitherSymbolOrErr.isLeft()) return

  const poolToken = await getPoolToken(
    poolTokenContract,
    BSC_NETWORK_CHAIN_ID, // fix chainID
    pool.id,
  )
  let totalPoolValue = BigNumber.from(0)
  if (poolToken.equals(IBALPACA)) {
    // convert to alpaca amount
    const maybeAlpacaVaultContract = alpacaVaultContract.getInstance()
    if (maybeAlpacaVaultContract) {
      const [totalSupply, totalToken] = await Promise.all([
        maybeAlpacaVaultContract.totalSupply(), // ib amount
        maybeAlpacaVaultContract.totalToken(), // alpaca amount
      ])
      totalPoolValue = await singleAssetTotalPoolValue(
        ALPACA,
        pairContractFactory,
        BigNumber.from(pool.balance).mul(totalToken).div(totalSupply),
      )
      return totalPoolValue
    }
  } else {
    totalPoolValue = await singleAssetTotalPoolValue(
      poolToken,
      pairContractFactory,
      BigNumber.from(pool.balance),
    )
    return totalPoolValue
  }
}

// TODO: workaround method, need to be able to address a hop if the pair is not -BNB or -BUSD
// NOTE: WORKS only for PCS LatteBUSD 19/09/21
export const processPCSLatteBUSD = async (
  pool: IPoolsQueryResultFieldsDTO,
  pairContractFactory: (
    pairAddress?: string | undefined,
  ) => LatteSwapPair | null,
): Promise<BigNumber> => {
  const bindedPair = pairContractFactory(pool.pair) as LatteSwapPair
  const [token0, [reserve0, reserve1]] = await Promise.all([
    await bindedPair.token0(),
    await bindedPair.getReserves(),
  ])
  const totalSupply = await bindedPair.totalSupply()
  const reserveBusd =
    token0.toLowerCase() === BUSD.address.toLowerCase() ? reserve0 : reserve1

  const totalPoolValue =
    reserveBusd.isZero() || totalSupply.isZero()
      ? ZERO
      : BigNumber.from(pool.balance).mul(reserveBusd).mul(2).div(totalSupply)

  return totalPoolValue
}
export const POOL_DENY = [...OG_OWNER_TOKENS]
export class GetTotalValueLockedUsecase
  implements UseCase<void, Promise<response>>
{
  private readonly alpacaTokenAdapter: IAlpacaAdapter
  private readonly erc20TokenContractFactory: (tokenAddress?: string) => ERC20
  private readonly pairContractFactory: (pairAddress?: string) => LatteSwapPair
  /**
   * @param  {ILatteAdapter} latteTokenAdapter - an adapter for LATTE token contract
   */
  constructor(
    alpacaTokenAdapter: IAlpacaAdapter,
    erc20TokenContractFactory: (tokenAddress?: string) => ERC20,
    pairContractFactory: (pairAddress?: string) => LatteSwapPair,
  ) {
    this.alpacaTokenAdapter = alpacaTokenAdapter
    this.erc20TokenContractFactory = erc20TokenContractFactory
    this.pairContractFactory = pairContractFactory
  }
  /**
   * executing the usecase
   * @returns Promise
   */
  public async execute(): Promise<response> {
    const poolsQueryResult: IPoolsQueryResultDTO = await request(
      masterBaristaGraph,
      poolsQuery,
    )
    const pools = poolsQueryResult.pools
    const pairAddresses = pools
      .map((pool) => {
        return pool.pair
      })
      .sort()

    const pairsQuery: IPairSubsetQueryResultDTO = await request(
      exchangeGraph,
      pairSubsetQuery,
      {
        pairAddresses,
      },
    )

    const pairs = pairsQuery.pairs
    const filtered = pools.filter(
      (pool) =>
        !POOL_DENY.map((token) => {
          return token.toLowerCase()
        }).includes(pool?.id.toLowerCase()),
    )
    try {
      const maybeProcessedFarms = await Promise.all(
        filtered.map(async (pool) => {
          const maybeStakingTokenContract = this.erc20TokenContractFactory(
            pool.id,
          )
          if (!maybeStakingTokenContract) return
          const pair = pairs.find((pair) => {
            return pair.id.toLowerCase() === pool.pair.toLowerCase()
          })
          if (pair) {
            return await processLiquidityPool(pool, pair)
          }

          if (WHITELIST_PCS_POOLS.includes(pool.pair.toLowerCase())) {
            return await processPCSLatteBUSD(pool, this.pairContractFactory)
          }

          return await processSingleAsset(
            pool,
            maybeStakingTokenContract,
            this.alpacaTokenAdapter,
            this.pairContractFactory,
          )
        }),
      )
      const tvl = maybeProcessedFarms.reduce((acc, f) => {
        if (f) {
          return acc.add(f)
        }
        return acc
      }, BigNumber.from(0))

      const result = formatEther(tvl)
      return right(Result.ok<string>(result.toString()))
    } catch (err) {
      return left(err)
    }
  }
}
