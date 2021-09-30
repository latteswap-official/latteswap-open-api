import { getTotalValueLockedHandler } from '~/presentation/http/api/amm'
import express from 'express'

const getTotalValueLocked = express.Router()

getTotalValueLocked.get('/', (req, res) =>
  getTotalValueLockedHandler.execute(req, res),
)

export { getTotalValueLocked }
