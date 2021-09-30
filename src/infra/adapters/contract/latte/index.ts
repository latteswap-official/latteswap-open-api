import { BigNumber, Contract, ethers } from 'ethers'
import { ILatteAdapter } from './types'
import config from '~/infra/config'
import { LATTE } from '@latteswap/latteswap-contract/typechain/LATTE'
import { abi as LATTE_ABI } from '@latteswap/latteswap-contract/artifacts/contracts/farm/LATTE.sol/LATTE.json'

export class LatteAdapter implements ILatteAdapter {
  private latteAddress: string
  private latteInstance: LATTE
  private signerOrProvider?: ethers.Signer | ethers.providers.Provider

  constructor(_signerOrProvider: ethers.Signer | ethers.providers.Provider) {
    this.latteAddress = config.get('contractConfig.Tokens.LATTE')
    this.signerOrProvider = _signerOrProvider
    this.latteInstance = this._getInstance()
  }

  public getInstance(): LATTE {
    return this.latteInstance
  }

  public getTotalLock(): Promise<BigNumber> {
    return this.latteInstance.totalLock()
  }

  public getBalanceOf(holderAddress: string): Promise<BigNumber> {
    return this.latteInstance.balanceOf(holderAddress)
  }

  public async getTotalSupply(): Promise<BigNumber> {
    return this.latteInstance.totalSupply()
  }

  private _getInstance(): LATTE {
    return new Contract(
      this.latteAddress,
      LATTE_ABI,
      this.signerOrProvider,
    ) as LATTE
  }
}
