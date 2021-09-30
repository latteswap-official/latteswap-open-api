import * as express from 'express'
import {
  Result,
  Either,
  InternalServerError,
  BaseError,
  BadRequest,
  left,
  stdErrorLogger,
  defaultLogger,
} from '~/shared/core'

type IHttpResponse =
  | {
      data: Record<string, any>
    }
  | string

export abstract class BaseHandler {
  protected abstract executeImpl(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any>

  public async execute(
    req: express.Request,
    res: express.Response,
  ): Promise<void> {
    try {
      await this.executeImpl(req, res)
    } catch (err) {
      BaseHandler.parseResponse(
        res,
        left(Result.fail<InternalServerError>(new InternalServerError('foo'))),
      )
    }
  }

  public static jsonResponse(
    res: express.Response,
    code: number,
    message: IHttpResponse,
  ): any {
    return res.status(code).json(message)
  }

  public static parseResponse<R>(
    res: express.Response,
    usecaseEither: Either<Result<BaseError>, Result<R>>,
  ): any {
    if (usecaseEither.isRight()) {
      defaultLogger.info(usecaseEither.value.getValue())
      return BaseHandler.jsonResponse(res, 200, {
        data: {
          message: 'success',
          data: usecaseEither.value.getValue(),
        },
      })
    }
    const err = usecaseEither.value.errorValue()

    defaultLogger.warn(`${err.message}-${err.reason}`)
    stdErrorLogger.error(err.maybeError)

    if (err instanceof InternalServerError) {
      return BaseHandler.jsonResponse(res, 400, {
        data: {
          message: err.message,
        },
      })
    }

    if (err instanceof BadRequest) {
      return BaseHandler.jsonResponse(res, 500, {
        data: {
          message: err.message,
        },
      })
    }
  }
}
