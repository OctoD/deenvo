import { isnull, isundefined, ensureFn } from "./common.ts";
import IMappable, { MappableFn } from "./IMappable.ts";
import IFilterable, { FilterableFn } from "./IFilterable.ts";
import IConditional, { ConditionalFn } from "./IConditional.ts";
import IUnwrappable, { UnwrappableFn } from "./IUnwrappable.ts";
import IAssertable from "./IAssertable.ts";
import { Result, ok, err } from "./result.ts";
import { Maybe, just, nothing } from "./mod.ts";

export class OptionLike<T>
  implements
    IAssertable<T>,
    IMappable<T>,
    IFilterable<T>,
    IConditional<T>,
    IUnwrappable<T> {
  public constructor(private _value: T) {}

  /**
   * If `T` is some and `Option<U>` is some, returns `Option<U>` otherwise returns `Option<T>`
   * 
   * ```ts
   * option(10).and(option(20)) // Some(20)
   * ```
   *
   * @template U
   * @param {Option<U>} other
   * @returns {(Option<T | U>)}
   * @memberof OptionLike
   */
  public and<U>(other: Option<U>): Option<T | U> {
    return this.isSome() ? other : this;
  }

  /**
   * Calls `fn(T): U` if `T` is some, otherwise returns `Option<T>`
   * 
   * ```ts
   * option(10).andThen(value => value * 10) // Some(100)
   * option(null).andThen(value => value * 10) // None()
   * ```
   *
   * @template U
   * @param {ConditionalFn<T, U>} fn
   * @returns {(Option<T | U>)}
   * @memberof OptionLike
   */
  public andThen<U>(fn: ConditionalFn<T, U>): Option<T | U> {
    return this.isSome() ? option(fn(this._value)) : this;
  }

  /**
   * Throws an error with the given `message` if is none, otherwise returns `Option<T>`
   * 
   * ```ts
   * option(10).expect('is not a number') // Some(10)
   * option(null).expect('is not a number') // throws
   * ```
   *
   * @param {string} message
   * @returns {(Option<T> | never)}
   * @memberof OptionLike
   */
  public expect(message: string): Option<T> | never {
    if (this.isNone()) {
      throw new Error(message);
    }

    return this;
  }

  /**
   * returns Option<T> if `FilterableFn<T>` returns true, otherwise returns `None`
   * 
   * ```
   * option(10).filter(value => value > 5) // Option(10)
   * option(10).filter(value => value < 5) // None()
   * ```
   *
   * @param {FilterableFn<T>} fn
   * @returns {Option<T>}
   * @memberof OptionLike
   */
  public filter(fn: FilterableFn<T>): Option<T> {
    ensureFn(fn, "Option.filter fn argument must be a function");
    return fn(this._value) ? this : none<T>();
  }

  /**
   * returns Option<T> if `FilterableFn<T>` returns true, otherwise returns `def`
   * 
   * ```
   * option(10).filter(Option(5), value => value > 5) // Option(10)
   * option(10).filter(Option(5), value => value < 5) // Option(5)
   * ```
   *
   * @param {FilterableFn<T>} fn
   * @returns {Option<T>}
   * @memberof OptionLike
   */
  public filterOr(def: Option<T>, fn: FilterableFn<T>): Option<T> {
    ensureFn(fn, "Option.filterOr fn argument must be a function");
    return fn(this._value) ? this : def;
  }

  /**
   * Returns true if `T` is none
   *
   * @returns {boolean}
   * @memberof OptionLike
   */
  public isNone(): boolean {
    return isundefined(this._value) || isnull(this._value);
  }

  /**
   * Returns true if `T` is some
   *
   * @returns {boolean}
   * @memberof OptionLike
   */
  public isSome(): boolean {
    return !this.isNone();
  }

  /**
   * Calls `MappableFn<T, U>` and returns `Option<U>` if is some, otherwise returns `Option<T>`
   * 
   * ```ts
   * option(2).map(value => 'hello'.repeat(value)) // Some('hellohello');
   * option(null).map(value => 'hello'.repeat(value)) // None();
   * ```
   *
   * @template U
   * @param {MappableFn<T, U>} fn
   * @returns {(Option<T | U>)}
   * @memberof OptionLike
   */
  public map<U>(fn: MappableFn<T, U>): Option<T | U> {
    return this.isSome() ? option(fn(this._value)) : this;
  }

  /**
   * Calls `MappableFn<T, U>` and returns `Option<U>` if is some, otherwise returns `Option<U>`
   * 
   * ```ts
   * option(2).mapOr(option('byebye'), value => 'hello'.repeat(value)) // Some('hellohello');
   * option(null).mapOr(option('byebye'), value => 'hello'.repeat(value)) // Some('byebye');
   * ```
   *
   * @template U
   * @param {Option<U>} def
   * @param {MappableFn<T, U>} fn
   * @returns {(Option<U>)}
   * @memberof OptionLike
   */
  public mapOr<U>(def: Option<U>, fn: MappableFn<T, U>): Option<U> {
    return this.isSome() ? option(fn(this._value)) : def;
  }

  /**
   * Calls `fn(T): U` if is some, otherwise calls `defFn(T): U`
   * 
   * ```ts
   * option(2).mapOrElse(() => 'byebye', value => 'hello'.repeat(value)) // Some('hellohello');
   * option(null).mapOrElse(() => 'byebye', value => 'hello'.repeat(value)) // Some('byebye');
   * ```
   *
   * @template U
   * @param {Option<U>} def
   * @param {MappableFn<T, U>} fn
   * @returns {(Option<U>)}
   * @memberof OptionLike
   */
  public mapOrElse<U>(
    defFn: MappableFn<T, U>,
    fn: MappableFn<T, U>,
  ): Option<U> {
    return this.isSome() ? option(fn(this._value)) : option(defFn(this._value));
  }

  /**
   * Returns `Maybe<T>` if is some, otherwise `Nothing`
   *
   * @returns {Maybe<T>}
   * @memberof OptionLike
   */
  public maybe(): Maybe<T> {
    return this.isSome() ? just(this._value) : nothing();
  }

  /**
   * Returns Option<T> if is some, otherwise returns `Option<U>`
   * 
   * ```ts
   * option(10).or(option(20))    // option(10)
   * option(null).or(option(20))  // option(20)
   * ```
   *
   * @template U
   * @param {Option<U>} other
   * @returns {(Option<T | U>)}
   * @memberof OptionLike
   */
  public or<U>(other: Option<U>): Option<T | U> {
    return this.isNone() ? other : this;
  }

  /**
   * Returns Option<T> if is some, otherwise calls `fn(): U`
   * 
   * ```ts
   * option(10).orThen(() => 0) // Option(10)
   * none().orThen(() => 0)     // Option(0)
   * ```
   *
   * @template U
   * @param {ConditionalFn<T, U>} fn
   * @returns {(Option<T | U>)}
   * @memberof OptionLike
   */
  public orThen<U>(fn: ConditionalFn<T, U>): Option<T | U> {
    return this.isNone() ? option(fn(this._value)) : this;
  }

  /**
   * Returns Ok<T> if is some, otherwise returns Err;
   *
   * @returns {Result<T>}
   * @memberof OptionLike
   */
  public result(): Result<T> {
    return this.isSome() ? ok(this._value) : err("value is none");
  }

  /**
   * Throws if is some, otherwise returns None
   *
   * @param {string} errormessage
   * @returns {(None | never)}
   * @memberof OptionLike
   */
  public unexpect(errormessage: string): None | never {
    if (this.isSome()) {
      throw new Error(errormessage);
    }

    return none();
  }

  /**
   * Unwraps `T` if is some, otherwise throws
   *
   * @param {string} [errormessage]
   * @returns {(T | never)}
   * @memberof OptionLike
   */
  public unwrap(
    errormessage: string = "Option.unwrap, value is none",
  ): T | never {
    this.expect(errormessage);
    return this._value;
  }

  /**
   * Unwraps `T` if is some, otherwise returns `def`
   * 
   * ```ts
   * option(10).unwrapOr(0) // 10
   * none().unwrapOr(0) // 0
   * ```
   *
   * @param {T} def
   * @returns {T}
   * @memberof OptionLike
   */
  public unwrapOr(def: T): T {
    return this.isSome() ? this._value : def;
  }

  /**
   * Unwraps `T` if is some, otherwise calls `UnwrappableFn<T>`
   * 
   * ```ts
   * option(10).unwrapOrElse(() => 0) // 10
   * none().unwrapOrElse(() => 0) // 0
   * ```
   *
   * @param {UnwrappableFn<T>} fn
   * @returns {T}
   * @memberof OptionLike
   */
  public unwrapOrElse(fn: UnwrappableFn<T>): T {
    ensureFn(fn, "Option.unwrapOrElse argument must be a function");
    return this.isSome() ? this._value : fn();
  }
}

export type None<T = null> = Option<T>;
export type Option<T> = OptionLike<T>;
export type Some<T> = Option<T>;

/**
 * Returns None
 *
 * @export
 * @template T
 * @returns {None<T>}
 */
export function none<T = null>(): None<T> {
  return option(null) as unknown as Option<T>;
}

/**
 * Returns `Option<T>`
 *
 * @export
 * @template T
 * @param {T} value
 * @returns {Option<T>}
 */
export function option<T>(value: T): Option<T> {
  return new OptionLike(value);
}

/**
 * Returns `Some<T>` if `T` is some, otherwise throws
 *
 * @export
 * @template T
 * @param {T} value
 * @returns {Some<T>}
 */
export function some<T>(value: T): Some<T> {
  return option<T>(value).expect("Some<T> T value cannot be undefined or null");
}
