import { Result, UseCase, right, left } from '~/shared/core'
import { request } from 'graphql-request'
import { formatEther } from '@ethersproject/units'
import { BigNumber } from 'ethers'
import { IAlpacaAdapter } from '~/infra/adapters/contract/alpaca/types'
import { ERC20, LatteSwapPair } from '@latteswap/latteswap-contract/typechain'

import {
  OG_OWNER_TOKENS,
  TOKEN_ADDRESSES,
  WHITELIST_PCS_POOLS,
} from '~/constants'
import { pairSubsetQuery, poolsQuery } from '~/infra/graphql/quries'
import config, {
  IPairSubsetQueryResultDTO,
  IPoolsQueryResultDTO,
} from '~/infra/config'
import {
  processLiquidityPool,
  processPCSLatteBUSD,
  processSingleAsset,
} from '../get_total_value_locked'
import { response } from '..'

const masterBaristaGraph = config.get('masterBaristaGraph')
const exchangeGraph = config.get('exchangeGraph')

export const POOL_DENY = [...OG_OWNER_TOKENS]
export class GetTotalValueLockedExceptLattePoolUsecase
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
          if (pool.id.toLowerCase() === TOKEN_ADDRESSES.LATTE.toLowerCase())
            return
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
