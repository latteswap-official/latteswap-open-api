import express from 'express'
import { getLattePoolValueLockedHandler } from '~/presentation/http/api/amm/defillama'

const getLattePoolTotalValueLockedForDefiLlama = express.Router()

getLattePoolTotalValueLockedForDefiLlama.get('/', (req, res) =>
  getLattePoolValueLockedHandler.execute(req, res),
)

export { getLattePoolTotalValueLockedForDefiLlama }
