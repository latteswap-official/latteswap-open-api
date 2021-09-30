import { InternalServerError, left, Result, right } from '~/shared/core'
import express from 'express'
import { BaseHandler } from '../..'
import { ammRouter } from './amm'

const v1Router = express.Router()

v1Router.get('/healthz', (req, res) => {
  return BaseHandler.parseResponse(res, right(Result.ok('success')))
})

v1Router.use('/amm', ammRouter)

export { v1Router }
