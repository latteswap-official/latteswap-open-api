import express from 'express'
import { getTotalValueLocked } from './get_total_value_locked'

const ammRouter = express.Router()

ammRouter.use('/total-value-locked', getTotalValueLocked)
export { ammRouter }
