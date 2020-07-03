import IMappable, { MappableFn } from "./IMappable.ts";
import IAssertable from "./IAssertable.ts";
import IConditional, { ConditionalFn } from "./IConditional.ts";
import { ensureFn } from "./common.ts";
import IUnwrappable, { UnwrappableFn } from "./IUnwrappable.ts";
import { Maybe, just, nothing } from "./mod.ts";
import { Option, some, none } from "./option.ts";

export class ResultLike<T, E extends Error = Error>
  implements IAssertable<T>, IConditional<T>, IMappable<T>, IUnwrappable<T> {
  public constructor(
    protected _value: T,
    protected _error: E | null = null,
  ) {
    if (_value instanceof Error) {
      this._value = undefined as unknown as T;
      this._error = _value as unknown as E;
    }
  }

  /**
   * Returns Result<U> if Result<T> is ok, otherwise returns Result<T>
   * 
   * ```ts
   * ok(10).and(ok(20)).isOk() // true
   * ok(10).and(err('darn')).isOk() // false
   * err('darn darn').and(ok(20)).isOk() // false
   * ```
   *
   * @template U
   * @param {Result<U>} other
   * @returns {(Result<T | U>)}
   * @memberof ResultLike
   */
  public and<U>(other: Result<U>): Result<T | U> {
    return this.isOk() ? other : this;
  }

  /**
   * Calls `fn(T): U` if `Result<T>` is ok and returns `Result<U>`, otherwise returns `Result<T>`
   * 
   * ```ts
   * ok(10).andThen(value => value * 2).unwrap() // 20
   * ok(10).andThen(() => { throw new Error('pizzaaaaaa') }).isOk() // false
   * ```
   *
   * @template U
   * @param {ConditionalFn<T, U>} fn
   * @returns {(Result<T | U>)}
   * @memberof ResultLike
   */
  public andThen<U>(fn: ConditionalFn<T, U>): Result<T | U> {
    ensureFn(fn, "Result.andThen fn argument must be a function");
    return this.isOk() ? result(fn(this._value)) : this;
  }

  /**
   * Throws an `Error` with the given `message` if it is not ok, otherwise returns `Ok<T>`
   * 
   * ```ts
   * err('wait for it').expect('explode')    // throws
   * ok(10).expect('result is not a number') // does not throw
   * ```
   *
   * @param {string} message
   * @returns {(Result<T, E> | never)}
   * @memberof ResultLike
   */
  public expect(message: string): Ok<T> | never {
    if (this.isErr()) {
      throw new Error(message);
    }

    return this;
  }

  /**
   * Returns `true` if the `Result<T>` is an error
   * 
   * ```ts
   * err('').isErr() // true
   * ok(10).isErr()  // false
   * ```
   *
   * @returns {boolean}
   * @memberof ResultLike
   */
  public isErr(): boolean {
    return this._value === undefined && this._error instanceof Error;
  }

  /**
   * Returns `true` if the `Result<T>` is ok
   * 
   * ```ts
   * err('').isOk() // false
   * ok(10).isOk()  // true
   * ```
   *
   * @returns {boolean}
   * @memberof ResultLike
   */
  public isOk(): boolean {
    return !this.isErr();
  }

  /**
   * Calls `fn(T): U` is the `Result<T>` is ok and returns a new `Result<U>`, otherwise returns `Result<T>`
   *
   * @template U
   * @param {MappableFn<T, U>} fn
   * @returns {(Result<T | U>)}
   * @memberof ResultLike
   */
  public map<U>(fn: MappableFn<T, U>): Result<T | U> {
    return this.isOk() ? result(fn(this._value)) : this;
  }

  /**
   * Calls `fn(T): U` is the `Result<T>` is ok and returns a new `Result<U>`, otherwise returns `def`
   *
   * @template U
   * @param {MappableFn<T, U>} fn
   * @returns {(Result<T | U>)}
   * @memberof ResultLike
   */
  public mapOr<U>(def: Result<U>, fn: MappableFn<T, U>): Result<T | U> {
    return this.isOk() ? result(fn(this._value)) : def;
  }

  /**
   * Calls `fn(T): U` is the `Result<T>` is ok and returns a new `Result<U>`, otherwise calls `defFn(T): U`
   *
   * @template U
   * @param {MappableFn<T, U>} fn
   * @returns {(Result<T | U>)}
   * @memberof ResultLike
   */
  public mapOrElse<U>(
    defFn: MappableFn<T, U>,
    fn: MappableFn<T, U>,
  ): Result<T | U> {
    return this.isOk() ? result(fn(this._value)) : result(defFn(this._value));
  }

  /**
   * If is ok, returns `Just<T>`, otherwise `Nothing<T>`;
   *
   * @returns {Maybe<T>}
   * @memberof ResultLike
   */
  public maybe(): Maybe<T> {
    return this.isOk() ? just(this._value) : nothing();
  }

  /**
   * If is ok, returns a `Some<T>`, otherwise `None`;
   *
   * @returns {Maybe<T>}
   * @memberof ResultLike
   */
  public option(): Option<T> {
    return this.isOk() ? some(this._value) : none();
  }

  /**
   * If `Result<T>` is `Err`, returns `other`, otherwise returns `Result<T>`
   * 
   * ```ts
   * ok(1).or(ok(2)).unwrap()       // 1
   * err('darn').or(ok(1)).unwrap() // 1
   * ```
   *
   * @template U
   * @param {Result<U>} other
   * @returns {(Result<T | U>)}
   * @memberof ResultLike
   */
  public or<U>(other: Result<U>): Result<T | U> {
    return this.isErr() ? other : this;
  }

  /**
   * If `Result<T>` is `Err`, calls `fn(T): U`, otherwise returns `Result<T>`
   * 
   * ```ts
   * ok(10).orThen(() => 20).unwrap()       // 10
   * err('errrr').orThen(() => 10).unwrap() // 10
   * ```
   *
   * @template U
   * @param {ConditionalFn<T, U>} fn
   * @returns {(Result<T | U>)}
   * @memberof ResultLike
   */
  public orThen<U>(fn: ConditionalFn<T, U>): Result<T | U> {
    ensureFn(fn, "Result.andThen fn argument must be a function");
    return this.isErr() ? result(fn(this._value)) : this;
  }

  /**
   * Throws if is `ok`, otherwise returns `Err<T>`
   *
   * @param {string} message
   * @returns {(never | Err<T>)}
   * @memberof ResultLike
   */
  public unexpect(message: string): never | Err<T> {
    if (this.isOk()) {
      throw new Error(message);
    }

    return err(this._error as E);
  }

  /**
   * If is ok, returns `T`, otherwise throws an error
   *
   * @param {string} errormessage
   * @returns {(T | never)}
   * @memberof ResultLike
   */
  public unwrap(errormessage: string = "Cannot unwrap Err<T>"): T | never {
    this.expect(errormessage);
    return this._value;
  }

  /**
   * Returns `T` if is ok, otherwise returns `fallback`
   *
   * @param {T} fallback
   * @returns {T}
   * @memberof ResultLike
   */
  public unwrapOr(fallback: T): T {
    return this.isOk() ? this._value : fallback;
  }

  /**
   * Returns `T` if is ok, otherwise calls `fn(): T`
   *
   * @param {UnwrappableFn<T>} fn
   * @returns {T}
   * @memberof ResultLike
   */
  public unwrapOrElse(fn: UnwrappableFn<T>): T {
    return this.isOk() ? this._value : fn();
  }
}

export type Err<T = any> = ResultLike<T>;
export type Ok<T> = ResultLike<T>;
export type Result<T, E extends Error = Error> = ResultLike<T, E>;

/**
 * Creates an `Err<T>`
 *
 * @export
 * @template T
 * @param {(string | Error)} messageOrError
 * @returns {Err<T>}
 */
export function err<T = any>(messageOrError: string | Error): Err<T> {
  return typeof messageOrError === "string"
    ? result<T>(new Error(messageOrError))
    : result<T>(messageOrError);
}

/**
 * Creates an `Ok<T>`. It throws if the value is an `Error` instance.
 *
 * @export
 * @template T
 * @param {T} value
 * @returns {Ok<T>}
 */
export function ok<T>(value: T): Ok<T> {
  return result(value).expect("ok value must not be an error");
}

/**
 * Creates a `Result<T>`
 *
 * @export
 * @template T
 * @template E
 * @param {(T | E)} value
 * @returns {ResultLike<T, E>}
 */
export function result<T, E extends Error = Error>(
  value: T | E,
): ResultLike<T, E> {
  return new ResultLike<T, E>(value as T);
}
