/**
 * Explicit success/failure model for business operations.
 * Resolves the need to throw exceptions for routine business outcomes.
 */
export type Result<T, E = Error> = 
  | { isSuccess: true; value: T; error?: never }
  | { isSuccess: false; value?: never; error: E };

export const Result = {
  ok<T>(value: T): Result<T, never> {
    return { isSuccess: true, value };
  },
  fail<E>(error: E): Result<never, E> {
    return { isSuccess: false, error };
  }
};
