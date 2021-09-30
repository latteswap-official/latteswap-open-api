import convict from 'convict'
import { IEnvironment } from './types'
import ProdConfig from '@latteswap/latteswap-contract-config/prod.json'
import DevelopConfig from '@latteswap/latteswap-contract-config/develop.json'

const _config = convict({
  env: {
    doc: 'The application environment.',
    format: ['develop', 'staging', 'prod'],
    default: 'develop',
    env: 'NODE_ENV',
  },
  bsc_scan_url: {
    doc: 'bsc scan url',
    env: 'APP_SCAN_URL',
    default: '',
  },
})

const environments: { [env: string]: IEnvironment } = {
  develop: {
    thirdparty: {
      provider: {
        name: 'Binance Smart Chain - Testnet',
        rpc: [
          'https://data-seed-prebsc-2-s3.binance.org:8545/',
          'https://data-seed-prebsc-2-s1.binance.org:8545/',
          'https://data-seed-prebsc-1-s2.binance.org:8545/',
        ],
        chainID: '97',
      },
    },
    contractConfig: DevelopConfig,
    ibALPACA: '0xf1bE8ecC990cBcb90e166b71E368299f0116d421',
    masterBaristaGraph: 'https://api.thegraph.com/subgraphs/name/latteswap-official/master-barista-dev',
    exchangeGraph: 'https://api.thegraph.com/subgraphs/name/latteswap-official/exchange-dev'
  },
  prod: {
    thirdparty: {
      provider: {
        name: 'Binance Smart Chain - Mainnet Prod',
        rpc: [process.env.BSC_RPC_URL],
        chainID: '56',
      },
    },
    contractConfig: ProdConfig,
    ibALPACA: '0xf1bE8ecC990cBcb90e166b71E368299f0116d421',
    masterBaristaGraph: 'https://api.thegraph.com/subgraphs/name/latteswap-official/master-barista',
    exchangeGraph: 'https://api.thegraph.com/subgraphs/name/latteswap-official/exchange'
  },
}

const config = _config.load(environments[_config.get('env')])

export * from './types'
export default config
