import {
  AlpacaAdapter,
  usePairContractFactory,
  useTokenContractFactory,
} from '~/infra/adapters/contract'
import { getNetworkLibrary } from '~/infra/connectors/blockchain'
import { GetTotalValueLockedUsecase } from '~/usecases/amm/get_total_value_locked'
import { GetTotalValueLockedHandler } from './get_total_value_locked'

const providers = getNetworkLibrary()

const getTotalValueLocked = new GetTotalValueLockedUsecase(
  new AlpacaAdapter(providers[0]),
  useTokenContractFactory(),
  usePairContractFactory(),
)

export const getTotalValueLockedHandler = new GetTotalValueLockedHandler(
  getTotalValueLocked,
)
