import { Result } from './result'
interface IBaseError {
  message: string
}

export abstract class BaseError implements IBaseError {
  public readonly message: string
  public readonly reason: string
  public readonly maybeError: Error | null | undefined

  constructor(message: string, reason: string, err?: Error) {
    this.message = message
    this.reason = reason
    this.maybeError = err
  }
}

export class InternalServerError extends BaseError {
  constructor(reason: string, err?: Error) {
    super('Internal Server Error', reason, err)
  }
}

export class BadRequest extends BaseError {
  constructor(reason: string, err?: Error) {
    super('Bad Request', reason, err)
  }
}
