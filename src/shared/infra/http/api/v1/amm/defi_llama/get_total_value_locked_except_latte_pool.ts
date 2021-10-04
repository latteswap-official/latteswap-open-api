import express from 'express'
import { getTotalValueLockedExceptLattePoolHandler } from '~/presentation/http/api/amm/defillama'

const getTotalValueLockedForDefiLlama = express.Router()

getTotalValueLockedForDefiLlama.get('/', (req, res) =>
  getTotalValueLockedExceptLattePoolHandler.execute(req, res),
)

export { getTotalValueLockedForDefiLlama }
