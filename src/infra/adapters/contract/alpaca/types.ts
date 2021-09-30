import { Vault as AlpacaVault } from '@alpaca-finance/alpaca-contract/typechain/Vault'
import { BigNumber } from 'ethers'

export interface IAlpacaAdapter {
  getInstance(): AlpacaVault
  getBalanceOf(holderAddress: string): Promise<BigNumber>
  getTotalSupply(): Promise<BigNumber>
  getTotalToken(): Promise<BigNumber>
}
