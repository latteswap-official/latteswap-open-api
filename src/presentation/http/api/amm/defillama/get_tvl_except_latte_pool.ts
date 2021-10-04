import { BaseHandler } from '~/shared/infra/http'
import * as express from 'express'
import { StatusCodes } from 'http-status-codes'
import { InternalServerError, Result, right } from '~/shared/core'
import { GetTotalValueLockedExceptLattePoolUsecase } from '~/usecases/amm/defi_llama'

export class GetTotalValueLockedExceptLattePoolHandler extends BaseHandler {
  private useCase: GetTotalValueLockedExceptLattePoolUsecase
  constructor(useCase: GetTotalValueLockedExceptLattePoolUsecase) {
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
