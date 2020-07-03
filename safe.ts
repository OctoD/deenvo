import { Result, ok, err } from "./result.ts";

/**
 * Executes a synchronous function FnTry, and returns a Result<T> where T is the ReturnType of that function 
 * @export
 * @template FnTry
 * @template K
 * @param {FnTry} fnTry
 * @param {...K} args
 * @returns {Result<ReturnType<FnTry>>}
 */
export function safe<FnTry extends (...args: K) => any, K extends any[]>(
  fnTry: FnTry,
  ...args: K
): Result<ReturnType<FnTry>> {
  try {
    return ok(fnTry.apply(null, args));
  } catch (error) {
    return err(error.message);
  }
}

/**
 * Executes an asynchronous function FnTry, and returns a Promise<Result<T>> where T is the ReturnType of that function 
 *
 * @export
 * @template FnTry
 * @template K
 * @param {FnTry} fnTry
 * @param {...K} args
 * @returns {Promise<Result<ReturnType<FnTry> extends Promise<infer U> ? U : ReturnType<FnTry>, Error>>}
 */
export async function safeAsync<
  FnTry extends (...args: K) => Promise<any>,
  K extends any[],
>(
  fnTry: FnTry,
  ...args: K
): Promise<
  Result<
    ReturnType<FnTry> extends Promise<infer U> ? U : ReturnType<FnTry>,
    Error
  >
> {
  try {
    const innerresult = await fnTry.apply(null, args);
    return ok(innerresult);
  } catch (error) {
    return err(error.message);
  }
}
