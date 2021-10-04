import express from 'express'
import { defiLlamaRouter } from './defi_llama'
import { getTotalValueLocked } from './get_total_value_locked'

const ammRouter = express.Router()

ammRouter.use('/defi-llama', defiLlamaRouter)
ammRouter.use('/total-value-locked', getTotalValueLocked)
export { ammRouter }
