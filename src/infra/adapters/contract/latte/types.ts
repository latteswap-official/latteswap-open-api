import { LATTE } from '@latteswap/latteswap-contract/typechain/LATTE'
import { BigNumber } from 'ethers'

export interface ILatteAdapter {
  getInstance(): LATTE
  getBalanceOf(holderAddress: string): Promise<BigNumber>
  getTotalSupply(): Promise<BigNumber>
  getTotalLock(): Promise<BigNumber>
}
