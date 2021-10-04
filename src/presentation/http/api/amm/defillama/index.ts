import {
  AlpacaAdapter,
  usePairContractFactory,
  useTokenContractFactory,
} from '~/infra/adapters/contract'
import { getNetworkLibrary } from '~/infra/connectors/blockchain'
import {
  GetTotalValueLockedExceptLattePoolUsecase,
  GetTotalValueLockedLattePoolUsecase,
} from '~/usecases/amm/defi_llama'
import { GetTotalValueLockedExceptLattePoolHandler } from './get_tvl_except_latte_pool'
import { GetTotalValueLockedLattePoolHandler } from './get_tvl_latte_pool'

const providers = getNetworkLibrary()
const getTotalValueLocked = new GetTotalValueLockedExceptLattePoolUsecase(
  new AlpacaAdapter(providers[0]),
  useTokenContractFactory(),
  usePairContractFactory(),
)

export const getTotalValueLockedExceptLattePoolHandler =
  new GetTotalValueLockedExceptLattePoolHandler(getTotalValueLocked)

const getLattePoolValueLocked = new GetTotalValueLockedLattePoolUsecase(
  useTokenContractFactory(),
  usePairContractFactory(),
)

export const getLattePoolValueLockedHandler =
  new GetTotalValueLockedLattePoolHandler(getLattePoolValueLocked)
