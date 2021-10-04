import { Result, UseCase, right, left } from '~/shared/core'
import { request } from 'graphql-request'
import { formatEther } from '@ethersproject/units'
import { ERC20, LatteSwapPair } from '@latteswap/latteswap-contract/typechain'

import { BSC_NETWORK_CHAIN_ID, TOKEN_ADDRESSES } from '~/constants'
import { poolsQuery } from '~/infra/graphql/quries'
import config, { IPoolsQueryResultDTO } from '~/infra/config'
import { BigNumber } from '@ethersproject/bignumber'
import { getPoolToken, response, singleAssetTotalPoolValue } from '..'

const masterBaristaGraph = config.get('masterBaristaGraph')
export class GetTotalValueLockedLattePoolUsecase
  implements UseCase<void, Promise<response>>
{
  private readonly erc20TokenContractFactory: (tokenAddress?: string) => ERC20
  private readonly pairContractFactory: (pairAddress?: string) => LatteSwapPair
  /**
   * @param  {ILatteAdapter} latteTokenAdapter - an adapter for LATTE token contract
   */
  constructor(
    erc20TokenContractFactory: (tokenAddress?: string) => ERC20,
    pairContractFactory: (pairAddress?: string) => LatteSwapPair,
  ) {
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
    const latte = pools.find(
      (pool) => pool.id.toLowerCase() === TOKEN_ADDRESSES.LATTE.toLowerCase(),
    )

    try {
      const maybeStakingTokenContract = this.erc20TokenContractFactory(latte.id)
      if (!maybeStakingTokenContract) return
      const poolToken = await getPoolToken(
        maybeStakingTokenContract,
        BSC_NETWORK_CHAIN_ID, // fix chainID
        latte.id,
      )
      const latteTVL = await singleAssetTotalPoolValue(
        poolToken,
        this.pairContractFactory,
        BigNumber.from(latte.balance),
      )
      const result = formatEther(latteTVL)
      return right(Result.ok<string>(result.toString()))
    } catch (err) {
      return left(err)
    }
  }
}
