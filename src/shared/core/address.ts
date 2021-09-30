import { getAddress } from '@ethersproject/address'

export function isAddressString(value: any): string {
  try {
    return getAddress(value)
  } catch {
    return ''
  }
}
