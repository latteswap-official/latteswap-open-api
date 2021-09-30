import { JsonRpcProvider } from '@ethersproject/providers'
import config, { IProvider } from '~/infra/config'

const provider: IProvider = config.get('thirdparty.provider')

const NETWORK_URLS = provider.rpc

export const NETWORK_CHAIN_ID: number = parseInt(provider.chainID)
export const BSC_NETWORK_CHAIN_ID: number = parseInt(
  process.env.REACT_APP_BSC_CHAIN_ID ?? '56',
)

export function getNetworkLibrary(): Array<JsonRpcProvider> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NETWORK_URLS.map((network) => {
    return new JsonRpcProvider(network, {
      name: 'binance smart chain',
      chainId: NETWORK_CHAIN_ID,
    })
  })
}
