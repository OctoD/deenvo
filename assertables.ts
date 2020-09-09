import { check } from "./applicative.ts";
import { Predicate } from "./predicate.ts";

/**
 * Creates an expect function. This function checks if a given argument satisfies the given predicate.
 * If the condition is not satisfied, it throws
 * 
 * @example
 * const isstring = (arg: unknown): arg is string => typeof arg === 'string';
 * const expectstring = createExpect(isstring);
 * 
 * const foocheck = expectstring('myfn foo argument must be a string');
 * const barcheck = expectstring('myfn bar argument must be a string');
 * 
 * const myfn = (foo: unknown, bar: unknown) => [
 *    foocheck(foo),
 *    barcheck(bar)
 * ].join('--');
 * 
 * myfn('hello', 'world'); // 'hello--world';
 * myfn('hello', 123);     // Uncaught Error: myfn bar argument must be a string
 *
 * @template T
 * @param {Predicate<T>} predicate
 * @returns {((errormessage: string) => (arg: T) => T)}
 */
export const createExpect = <T>(
  predicate: Predicate<T>,
) =>
  (errormessage: string) =>
    (arg: T): T => check(predicate(arg), errormessage)(arg) as T;
