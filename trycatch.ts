import { err, ok, Result } from "./result.ts";

export const trycatch = <FnTry extends (...args: K) => any, K extends any[]>(
  fn: FnTry,
  ...args: K
): Result<ReturnType<FnTry>> => {
  try {
    return ok(fn.apply(null, args));
  } catch (error) {
    return err(error);
  }
};

export const trycatchAsync = async <
  FnTry extends (...args: K) => Promise<any>,
  K extends any[],
>(
  fn: FnTry,
  ...args: K
): Promise<ReturnType<FnTry> extends Promise<infer U> ? Result<U> : never> => {
  try {
    const returnvalue = await fn.apply(null, args);
    return ok(returnvalue) as any;
  } catch (error) {
    return err(error) as any;
  }
};
