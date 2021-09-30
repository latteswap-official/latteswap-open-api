import { Either, left, right } from '~/shared/core'

export async function wrapErr<T>(
  p: Promise<T>,
): Promise<Either<any, T | undefined>> {
  try {
    const result = await p
    return right(result)
  } catch (err) {
    return left(err)
  }
}
