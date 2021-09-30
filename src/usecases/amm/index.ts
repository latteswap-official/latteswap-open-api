import { Either, Result, BaseError } from '~/shared/core'

export type response = Either<Result<BaseError>, Result<string>>

export * from './get_total_value_locked'