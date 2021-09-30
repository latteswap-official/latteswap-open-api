import { Token } from '@latteswap/sdk'
import { BigNumber } from 'ethers'
import config from '~/infra/config'
import { TOKEN_ADDRESSES } from './addresses'
export const GAS_LIMIT = BigNumber.from('1000000')
export const HUNDRED_PERCENT_BASIS_POINT = BigNumber.from('10000')
export const ZERO = BigNumber.from('0')
export const DEAD_ADDRESS = '0x000000000000000000000000000000000000dEaD'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
import { OG_OWNER_TOKENS } from './addresses'
export * from './addresses'
export const NetworkContextName = 'NETWORK'
export const POOL_DENY = [...OG_OWNER_TOKENS]

export const BSC_NETWORK_CHAIN_ID: number = parseInt(
  process.env.REACT_APP_BSC_CHAIN_ID ?? '56',
)

// ALPACA
export const IBALPACA_ADDRESSS = config.get('ibALPACA')
export const IBALPACA: Token = new Token(
  BSC_NETWORK_CHAIN_ID,
  IBALPACA_ADDRESSS,
  18,
  'ibALPACA',
  'Interest Bearing ALPACA',
)

export const ALPACA_ADDRESS = '0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F'
export const ALPACA: Token = new Token(
  BSC_NETWORK_CHAIN_ID,
  ALPACA_ADDRESS,
  18,
  'ALPACA',
  'AlpacaToken',
)

export const BUSD: Token = new Token(
  BSC_NETWORK_CHAIN_ID,
  TOKEN_ADDRESSES.BUSD,
  18,
  'BUSD',
  'Binance USD',
)
