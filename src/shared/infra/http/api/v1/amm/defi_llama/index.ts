import express from 'express'
import { getTotalValueLockedForDefiLlama } from './get_total_value_locked_except_latte_pool'
import { getLattePoolTotalValueLockedForDefiLlama } from './get_total_value_locked_latte_pool'

const defiLlamaRouter = express.Router()
defiLlamaRouter.use('/tvl-exclude-latte', getTotalValueLockedForDefiLlama)
defiLlamaRouter.use('/tvl-latte-pool', getLattePoolTotalValueLockedForDefiLlama)
export { defiLlamaRouter }
