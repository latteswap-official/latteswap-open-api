import prodConfig from '@latteswap/latteswap-contract-config/prod.json'
import developConfig from '@latteswap/latteswap-contract-config/develop.json'
import { BigNumber } from 'ethers'

type TTokenKey = keyof typeof prodConfig.Tokens

type TConfig = {
  ProxyAdmin: string
  Timelock: string
  Factory: string
  Router: string
  MasterBarista: string
  LatteVault: string
  InitCodeHash: string
  LP: Record<string, string>
  Tokens: Record<TTokenKey, string>
  OGOwnerToken: Record<string, string>
  Booster: string
  BoosterConfig: string
  LatteNFT: string
  BeanBag: string
  MultiCall: string
  WnativeRelayer: string
  LatteMarket: string
  OGNFT: string
  OGNFTOffering: string
  TripleSlopPriceModel: string
}

export function getConfig(): TConfig {
  switch (process.env.NODE_ENV) {
    case 'prod':
      return prodConfig
    default:
      return developConfig
  }
}

export const contractConfig = getConfig()

export const ROUTER_ADDRESS: string = contractConfig.Router
export const MASTER_BARISTA_ADDRESS: string = contractConfig.MasterBarista
export const BOOSTER_ADDRESS: string = contractConfig.Booster
export const BOOSTER_CONFIG_ADDRESS: string = contractConfig.BoosterConfig
export const LATTE_NFT_ADDRESS: string = contractConfig.LatteNFT
export const OG_NFT_ADDRESS: string = contractConfig.OGNFT
export const OG_NFT_OFFERING_ADDRESS: string = contractConfig.OGNFTOffering
export const OG_OWNER_TOKENS: Array<string> = Object.values(
  contractConfig.OGOwnerToken,
)
export const OG_OWNER_TOKEN_IDS: Array<BigNumber> = Object.keys(
  contractConfig.OGOwnerToken,
).map((r: string) => BigNumber.from(r))

export const WHITELIST_PCS_POOLS: Array<string> = Object.keys(
  contractConfig.LP,
).reduce((acc: Array<string>, cur: string) => {
  // not start with "PCS_"
  if (!cur.match(/^(PCS_).*$/g)) {
    return acc
  }

  // prevent value is empty string
  if (!contractConfig.LP[cur] || contractConfig.LP[cur].length === 0) {
    return acc
  }

  acc.push(contractConfig.LP[cur].toLowerCase())

  return acc
}, [])

export const TOKEN_ADDRESSES: Record<TTokenKey, string> = {
  LATTE: contractConfig.Tokens.LATTE,
  BUSD: contractConfig.Tokens.BUSD,
  WBNB: contractConfig.Tokens.WBNB,
  ETH: contractConfig.Tokens.ETH,
  BTCB: contractConfig.Tokens.BTCB,
  CAKE: contractConfig.Tokens.CAKE,
  ALPACA: contractConfig.Tokens.ALPACA,
  XVS: contractConfig.Tokens.XVS,
  EPS: contractConfig.Tokens.EPS,
  BELT: contractConfig.Tokens.BELT,
  MDX: contractConfig.Tokens.MDX,
  AUTO: contractConfig.Tokens.AUTO,
  BSW: contractConfig.Tokens.BSW,
  WEX: contractConfig.Tokens.WEX,
  O3: contractConfig.Tokens.O3,
  BIFI: contractConfig.Tokens.BIFI,
  BAKE: contractConfig.Tokens.BAKE,
  BANANA: contractConfig.Tokens.BANANA,
  BUNNY: contractConfig.Tokens.BUNNY,
  DOGE: contractConfig.Tokens.DOGE,
  USDC: contractConfig.Tokens.USDC,
  USDT: contractConfig.Tokens.USDT,
}

export default {
  CONTRACT_CONFIG: contractConfig,
  ROUTER_ADDRESS: ROUTER_ADDRESS,
  MASTER_BARISTA_ADDRESS: MASTER_BARISTA_ADDRESS,
  BOOSTER_ADDRESS: BOOSTER_ADDRESS,
  TOKEN_ADDRESSES,
}
