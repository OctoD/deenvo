import IMappable, { MappableFn } from "./IMappable.ts";
import { ensureFn } from "./common.ts";
import IUnwrappable, { UnwrappableFn } from "./IUnwrappable.ts";
import IAssertable from "./IAssertable.ts";
import { IConditional } from "./mod.ts";
import { ConditionalFn } from "./IConditional.ts";
import { Option, some, none } from "./option.ts";
import { Result, ok, err } from "./result.ts";

export class MaybeLike<T>
  implements IAssertable<T>, IConditional<T>, IMappable<T>, IUnwrappable<T> {
  public constructor(
    protected _value: T,
    protected _isjust: boolean = !!_value,
  ) {}

  /**
   * Returns `Maybe<U>` if `T` is `Just<T>`, otherwise returns `Maybe<T>`
   * 
   * ```ts
   * maybe(10).and(maybe(20))   // Maybe(20)
   * maybe(null).and(maybe(10)) // Maybe(null)
   * ```
   *
   * @template U
   * @param {Maybe<U>} other
   * @returns {(Maybe<T | U>)}
   * @memberof MaybeLike
   */
  public and<U>(other: Maybe<U>): Maybe<T | U> {
    return this.isJust() ? other : this;
  }

  /**
   * Calls `fn(T): U` if `T` is `Just<T>`, otherwise returns `Maybe<T>`
   *
   * @template U
   * @param {ConditionalFn<T, U>} fn
   * @returns {(Maybe<T | U>)}
   * @memberof MaybeLike
   */
  public andThen<U>(fn: ConditionalFn<T, U>): Maybe<T | U> {
    return this.isJust() ? maybe(fn(this._value)) : this;
  }

  /**
   * Throws if `T` is `Nothing`, otherwise returns `Just<T>`
   *
   * @param {string} message
   * @returns {(Just<T> | never)}
   * @memberof MaybeLike
   */
  public expect(message: string): Just<T> | never {
    if (this.isNothing()) {
      throw new TypeError(message);
    }

    return this;
  }

  /**
   * Returns `true` if is `Just<T>`
   *
   * @returns {boolean}
   * @memberof MaybeLike
   */
  public isJust(): boolean {
    return this._isjust;
  }

  /**
   * Returns `true` if is `Nothing`
   *
   * @returns {boolean}
   * @memberof MaybeLike
   */
  public isNothing(): boolean {
    return !this.isJust();
  }

  /**
   * Calls `fn(T): U` and returns `Maybe<U>` if is `Just<T>`, otherwise returns `Maybe<T>`
   * 
   * ```ts
   * maybe(10).map(a => a ** 2)     // Maybe(100) 
   * maybe(null).map(a => a ** 2)   // Maybe(null) 
   * ```
   *
   * @template U
   * @param {MappableFn<T, U>} fn
   * @returns {(Maybe<T | U>)}
   * @memberof MaybeLike
   */
  public map<U>(fn: MappableFn<T, U>): Maybe<T | U> {
    ensureFn(fn, "Maybe.map fn argument must be a function");
    return this.isJust() ? maybe(fn(this._value)) : nothing<T>();
  }

  /**
   * Calls `fn(T): U` and returns `Maybe<U>` if is `Just<T>`, otherwise returns `def`
   *
   * @template U
   * @param {Maybe<U>} def
   * @param {MappableFn<T, U>} fn
   * @returns {(Maybe<U>)}
   * @memberof MaybeLike
   */
  public mapOr<U>(def: Maybe<U>, fn: MappableFn<T, U>): Maybe<U> {
    ensureFn(fn, "Maybe.mapOr fn argument must be a function");
    return this.isJust() ? maybe(fn(this._value)) : def;
  }

  /**
   * Calls `fn(T): U` and returns `Maybe<U>` if is `Just<T>`, otherwise calls `defFn`
   *
   * @template U
   * @param {MappableFn<T, U>} defFn
   * @param {MappableFn<T, U>} fn
   * @returns {(Maybe<U>)}
   * @memberof MaybeLike
   */
  public mapOrElse<U>(
    defFn: MappableFn<T, U>,
    fn: MappableFn<T, U>,
  ): Maybe<U> {
    ensureFn(defFn, "Maybe.mapOrElse defFn argument must be a function");
    ensureFn(fn, "Maybe.mapOrElse fn argument must be a function");
    return maybe(this.isJust() ? fn(this._value) : defFn(this._value));
  }

  /**
   * Returns `Option<T>` if is `Just<T>`, otherwise returns `None`
   *
   * @returns {Option<T>}
   * @memberof MaybeLike
   */
  public option(): Option<T> {
    return this.isJust() ? some(this._value) : none();
  }

  /**
   * Returns `Maybe<T>` if is `Just<T>`, otherwise returns `other`
   * 
   * ```ts
   * maybe(5).or(maybe(10))     // `Maybe(5)`
   * maybe(null).or(maybe(10))  // `Maybe(10)`
   * ```
   *
   * @template U
   * @param {Maybe<U>} other
   * @returns {(Maybe<T | U>)}
   * @memberof MaybeLike
   */
  public or<U>(other: Maybe<U>): Maybe<T | U> {
    return this.isNothing() ? other : this;
  }

  /**
   * Returns `Maybe<T>` if is `Just<T>`, otherwise calls `fn` and returns `Maybe<U>`
   * 
   * ```ts
   * maybe(5).orThen(() => 10)      // `Maybe(5)`
   * maybe(null).orThen(() => 10)   // `Maybe(10)`
   * ```
   *
   * @template U
   * @param {ConditionalFn<T, U>} fn
   * @returns {(Maybe<T | U>)}
   * @memberof MaybeLike
   */
  public orThen<U>(fn: ConditionalFn<T, U>): Maybe<T | U> {
    return this.isNothing() ? maybe(fn(this._value)) : this;
  }

  /**
   * Returns `Ok<T>` if is `Just<T>` otherwise returns `Err`
   *
   * @returns {Result<T>}
   * @memberof MaybeLike
   */
  public result(): Result<T> {
    return this.isJust() ? ok(this._value) : err("value is nothing");
  }

  /**
   * Throws if is `Just<T>` otherwise returns `Nothing<T>`
   *
   * @param {string} message
   * @returns {(Nothing<T> | never)}
   * @memberof MaybeLike
   */
  public unexpect(message: string): Nothing<T> | never {
    if (this.isJust()) {
      throw new TypeError(message);
    }

    return this;
  }

  /**
   *
   *
   * @param {string} [message]
   * @returns {T}
   * @memberof MaybeLike
   */
  public unwrap(message?: string): T {
    this.expect(message || "value T is nothing");
    return this._value;
  }

  /**
   *
   *
   * @param {T} fallbackValue
   * @returns {T}
   * @memberof MaybeLike
   */
  public unwrapOr(fallbackValue: T): T {
    return this.isJust() ? this._value : fallbackValue;
  }

  /**
   *
   *
   * @param {UnwrappableFn<T>} fn
   * @returns {T}
   * @memberof MaybeLike
   */
  public unwrapOrElse(fn: UnwrappableFn<T>): T {
    ensureFn(fn, "Maybe.unwrapOrElse fn argument must be a function");
    return this.isJust() ? this._value : fn();
  }
}

export type Just<T> = Maybe<T>;
export type Maybe<T> = MaybeLike<T>;
export type Nothing<T = any> = Maybe<T>;

export function just<T>(arg: T): Just<T> {
  return maybe(arg).expect("just argument is falsy");
}

export function maybe<T>(arg: T): Maybe<T> {
  return new MaybeLike<T>(arg);
}

export function nothing<T = any>(): Nothing<T> {
  return new MaybeLike(undefined as unknown as T);
}
