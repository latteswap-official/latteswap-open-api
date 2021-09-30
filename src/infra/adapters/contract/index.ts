import { getAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'
import { ERC20, LatteSwapPair } from '@latteswap/latteswap-contract/typechain'
import { ZERO_ADDRESS } from '~/constants'
import { getNetworkLibrary } from '~/infra/connectors/blockchain'
import { abi as LATTE_SWAP_PAIR_ABI } from '@latteswap/latteswap-contract/artifacts/contracts/swap/LatteSwapPair.sol/LatteSwapPair.json'
import ERC20_ABI from '~/constants/abis/erc20.json'

export * from './latte'
export * from './alpaca'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

const providers = getNetworkLibrary()

export function getContract(address: string, ABI: any): Contract {
  if (!isAddress(address) || address === ZERO_ADDRESS) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  try {
    return new Contract(address, ABI, providers[0])
  } catch (e) {
    return e
  }
}

export function useContractFactory(
  ABI: any,
): (address: string | undefined) => Contract | null {
  return (address: string | undefined) => {
    if (!address || !ABI) return null
    try {
      return getContract(address, ABI)
    } catch (error) {
      return null
    }
  }
}

export function usePairContractFactory(): (
  pairAddress?: string,
) => LatteSwapPair | null {
  return (pairAddress?: string) => {
    const factory = useContractFactory(LATTE_SWAP_PAIR_ABI)
    const result = factory(pairAddress)
    return result ? (result as LatteSwapPair) : null
  }
}

export function useTokenContractFactory(): (
  tokenAddress?: string,
) => ERC20 | null {
  const factory = useContractFactory(ERC20_ABI)

  return (tokenAddress?: string) => {
    const result = factory(tokenAddress)
    return result ? (result as ERC20) : null
  }
}
