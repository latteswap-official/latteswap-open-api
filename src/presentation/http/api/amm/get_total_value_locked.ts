import { BaseHandler } from '~/shared/infra/http'
import { GetTotalValueLockedUsecase } from '~/usecases/amm/get_total_value_locked'
import * as express from 'express'
import { StatusCodes } from 'http-status-codes'
import { InternalServerError, Result, right } from '~/shared/core'

export class GetTotalValueLockedHandler extends BaseHandler {
  private useCase: GetTotalValueLockedUsecase
  constructor(useCase: GetTotalValueLockedUsecase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    try {
      const result = await this.useCase.execute()
      if (result.isLeft()) {
        return BaseHandler.parseResponse(res, result)
      }
      return res.status(StatusCodes.OK).send(result.value.getValue())
    } catch (err) {
      return BaseHandler.parseResponse(
        res,
        right(
          Result.fail(
            new InternalServerError('catched from presentation', err),
          ),
        ),
      )
    }
  }
}
