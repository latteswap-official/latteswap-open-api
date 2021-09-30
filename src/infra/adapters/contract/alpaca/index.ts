import { BigNumber, ethers, Contract } from 'ethers'
import config from '~/infra/config'
import { IAlpacaAdapter } from './types'
import { Vault } from '@alpaca-finance/alpaca-contract/typechain/Vault'
import { abi as ALPACA_VAULT_ABI } from '@alpaca-finance/alpaca-contract/artifacts/contracts/6/protocol/Vault.sol/Vault.json'

export class AlpacaAdapter implements IAlpacaAdapter {
  private alpacaAddress: string
  private alpacaInstance: Vault
  private signerOrProvider?: ethers.Signer | ethers.providers.Provider

  constructor(_signerOrProvider: ethers.Signer | ethers.providers.Provider) {
    this.alpacaAddress = config.get('ibALPACA')
    this.signerOrProvider = _signerOrProvider
    this.alpacaInstance = this._getInstance()
  }

  public getInstance(): Vault {
    return this.alpacaInstance
  }

  public getBalanceOf(holderAddress: string): Promise<BigNumber> {
    return this.alpacaInstance.getBalanceOf(holderAddress)
  }

  public async getTotalSupply(): Promise<BigNumber> {
    return this.alpacaInstance.totalSupply()
  }

  public async getTotalToken(): Promise<BigNumber> {
    return this.alpacaInstance.totalToken()
  }

  private _getInstance(): Vault {
    return new Contract(
      this.alpacaAddress,
      ALPACA_VAULT_ABI,
      this.signerOrProvider,
    ) as Vault
  }
}
