import ProdConfig from '@latteswap/latteswap-contract-config/prod.json'
import DevelopConfig from '@latteswap/latteswap-contract-config/develop.json'

export type IConfig = typeof DevelopConfig | typeof ProdConfig

export interface IEnvironment {
  thirdparty: {
    provider: IProvider
  }
  contractConfig: IConfig
  ibALPACA: string
  masterBaristaGraph: string
  exchangeGraph: string
}

export interface IProvider {
  name: string
  rpc: Array<string>
  chainID: string
}

export interface IPairTokenFieldsDTO {
  id: string
  name: string
  symbol: string
  totalSupply: string // BigInt
  derivedBNB: string // BigDecimal
  decimals: string // BigInt
}

export interface IPairFieldsDTO {
  id: string
  reserveUSD: string
  reserveBNB: string
  volumeUSD: string
  untrackedVolumeUSD: string
  trackedReserveBNB: string
  token0: IPairTokenFieldsDTO
  token1: IPairTokenFieldsDTO
  reserve0: string // BigDecimal
  reserve1: string // BifDecimal
  token0Price: string // BigDecimal
  token1Price: string // BigDecimal
  totalSupply: string //BigDecimal
  txCount: string // BigInt
  timestamp: string // BigInt
}

export interface IPoolsQueryResultFieldsDTO {
  id: string
  pair: string
  allocPoint: string
  lastRewardBlock: string
  accLattePerShare: string
  balance: string
  userCount: string
  masterBarista: {
    totalAllocPoint: string
    lattePerBlock: string
  }
}

export interface IPoolsQueryResultDTO {
  pools: Array<IPoolsQueryResultFieldsDTO>
}
export interface IPairSubsetQueryResultDTO {
  pairs: Array<IPairFieldsDTO>
}
