import { ensureFn } from "./common.ts";
import { IImmediateComparisonConditional } from "./IConditional.ts";
import { IUnwrappable, UnwrappableFn } from "./IUnwrappable.ts";
import { Result, ok, err } from "./result.ts";
import { Option, some, none } from "./option.ts";
import { Maybe, just, nothing } from "./maybe.ts";
import { IAssertable } from "./IAssertable.ts";

export class RuntimeTypeLike<T>
  implements
    IAssertable<T>,
    IImmediateComparisonConditional<T>,
    IUnwrappable<T> {
  public constructor(
    protected _value: T,
    protected _underlyingtype: string,
    protected _typechecker: TypeCheckerFn,
  ) {
    ensureFn(
      _typechecker,
      `RuntimeTypeLike<${_underlyingtype}> typechecker must be a function`,
    );
  }

  /**
   * Returns RuntimeTypeLike<U> if T is a valid type, otherwise returns RuntimeTypeLike<T>;
   * 
   * ```ts
   * uint(10).and(uint(20))   // uint(20)
   * uint(-10).and(uint(20))  // uint(-10)
   * ```
   *
   * @template U
   * @param {RuntimeTypeLike<U>} other
   * @returns {(RuntimeTypeLike<T | U>)}
   * @memberof RuntimeTypeLike
   */
  public and<U>(other: RuntimeTypeLike<U>): RuntimeTypeLike<T | U> {
    return this.isvalid() ? other : this;
  }

  /**
   * Casts a type `T` to a type `U` and returns the cast operation as a `Result<RuntimeTypeLike<U>>`
   *
   * @template U
   * @param {RuntimeType<U>} other
   * @returns {Result<RuntimeTypeLike<U>>}
   * @memberof RuntimeTypeLike
   */
  public cast<U>(other: RuntimeType<U>): Result<RuntimeTypeLike<U>> {
    if (this.isnotvalid()) {
      return err("Type to cast cannot be casted because is invalid");
    }

    const maybecasted = other(this.unwrap() as unknown as U);

    return maybecasted.isvalid()
      ? ok(maybecasted)
      : err("Invalid cast operation");
  }

  /**
   * Returns the underlying value as `unknown`. It may be not a valid type
   *
   * @returns {unknown}
   * @memberof RuntimeTypeLike
   */
  public getunderlyingvalue(): unknown {
    return this._value;
  }

  /**
   * Throws if `T` is not valid type, otherwise returns `RuntimeTypeLike<T>`
   *
   * @param {string} [errormessage=`Expected type to be ${this._underlyingtype}, got ${typeof this._value}`]
   * @returns {(RuntimeTypeLike<T> | never)}
   * @memberof RuntimeTypeLike
   */
  public expect(
    errormessage =
      `Expected type to be ${this._underlyingtype}, got ${typeof this._value}`,
  ): RuntimeTypeLike<T> | never {
    if (this._typechecker(this._value)) {
      return this;
    }

    throw new TypeError(errormessage);
  }

  /**
   * Returns true if `T` is a valid type, otherwise `false`
   *
   * @returns {boolean}
   * @memberof RuntimeTypeLike
   */
  public isvalid(): boolean {
    return this._typechecker(this._value);
  }

  /**
   * Returns false if `T` is a valid type, otherwise `true`
   *
   * @returns {boolean}
   * @memberof RuntimeTypeLike
   */
  public isnotvalid(): boolean {
    return !this._typechecker(this._value);
  }

  /**
   * Returns `Just<T>` if `T` is a valid type, otherwise returns `Nothing`
   *
   * @returns {Maybe<T>}
   * @memberof RuntimeTypeLike
   */
  public maybe(): Maybe<T> {
    return this.isvalid() ? just(this._value) : nothing();
  }

  /**
   * Returns `RuntimeTypeLike<T>` if `T` is a valid type, otherwise returns `other`
   *
   * @template U
   * @param {RuntimeTypeLike<U>} other
   * @returns {(RuntimeTypeLike<T | U>)}
   * @memberof RuntimeTypeLike
   */
  public or<U>(other: RuntimeTypeLike<U>): RuntimeTypeLike<T | U> {
    return this.isvalid() ? this : other;
  }

  /**
   * Returns `Option<T>` if `T` is a valid type, otherwise returns `None`
   *
   * @returns {Option<T>}
   * @memberof RuntimeTypeLike
   */
  public option(): Option<T> {
    return this.isvalid() ? some(this._value) : none();
  }

  /**
   * Returns `Ok<T>` if `T` is a valid type, otherwise returns `Err`
   *
   * @param {string} [errormessage=`Invalid type ${typeof this._value} expected ${this._underlyingtype}`]
   * @returns {Result<T>}
   * @memberof RuntimeTypeLike
   */
  public result(
    errormessage = `Invalid type ${typeof this
      ._value} expected ${this._underlyingtype}`,
  ): Result<T> {
    return this.isvalid() ? ok(this._value) : err(errormessage);
  }

  /**
   * Returns underlying type name
   *
   * @returns {string}
   * @memberof RuntimeTypeLike
   */
  public typeof(): string {
    return this._underlyingtype;
  }

  /**
   * Throws if `T` is a valid type, otherwise returns `RuntimeTypeLike<T>` 
   *
   * @param {string} [errormessage=`Expected type not to be ${this._underlyingtype}`]
   * @returns {(RuntimeTypeLike<T> | never)}
   * @memberof RuntimeTypeLike
   */
  public unexpect(
    errormessage = `Expected type not to be ${this._underlyingtype}`,
  ): RuntimeTypeLike<T> | never {
    if (!this._typechecker(this._value)) {
      return this;
    }

    throw new TypeError(errormessage);
  }

  /**
   * Returns `T` if is a valid type, otherwise throws 
   *
   * @param {string} [errormessage=`Cannot unwrap invalid type ${this._underlyingtype}`]
   * @returns
   * @memberof RuntimeTypeLike
   */
  public unwrap(
    errormessage = `Cannot unwrap invalid type ${this._underlyingtype}`,
  ) {
    if (this.isvalid()) {
      return this._value;
    }

    throw new TypeError(errormessage);
  }

  /**
   * Returns `T` if is a valid type, otherwise returns `other`
   *
   * @param {T} other
   * @returns
   * @memberof RuntimeTypeLike
   */
  public unwrapOr(other: T) {
    return this.isvalid() ? this._value : other;
  }

  /**
   * Returns `T` if is a valid type, otherwise calls `fn`
   *
   * @param {T} other
   * @returns
   * @memberof RuntimeTypeLike
   */
  public unwrapOrElse(fn: UnwrappableFn<T>) {
    return this.isvalid() ? this._value : fn();
  }
}

type RuntimeTypeFn<T> = (value: T) => RuntimeTypeLike<T>;

export type TypeCheckerFn = (value: unknown) => boolean;
export type DerivedTypeCheckerFn<T> = (value: T) => boolean;

export type RuntimeType<T> = RuntimeTypeFn<T> & {
  derive<K extends T>(
    prefix: string,
    checker: DerivedTypeCheckerFn<T>,
  ): RuntimeType<K>;
};

function addDerive<T>(
  originalname: string,
  oriignaltypechecker: TypeCheckerFn,
  fn: RuntimeTypeFn<T>,
): RuntimeType<T> {
  (fn as RuntimeType<T>).derive = (prefix, additionalchecker) =>
    runtimetype(
      `${prefix}${originalname}`,
      (value) => oriignaltypechecker(value) && additionalchecker(value as T),
    );

  return fn as RuntimeType<T>;
}

/**
 * Typeguards which checks if `arg` is a RuntimeType<any> or not
 *
 * @export
 * @param {unknown} arg
 * @returns {arg is RuntimeType<any>}
 */
export function isruntimeType(arg: unknown): arg is RuntimeType<any> {
  return typeof arg === "function" && "derive" in arg;
}

/**
 * Creates a new type at runtime.
 * 
 * ```ts
 * const mytype = runtimetype<number | string>('numberorstring', arg => typeof arg === 'number' || (typeof arg === 'string') ? !isNaN(parseFloat(arg)) : false);
 * 
 * mytype(10).isvalid()               // true
 * mytype('10').isvalid()             // true
 * mytype('20.00').isvalid()          // true
 * mytype('hello wolrd').isvalid()    // false
 * ```
 *
 * @export
 * @template T
 * @param {string} name
 * @param {TypeCheckerFn} checker
 * @returns {RuntimeType<T>}
 */
export function runtimetype<T>(
  name: string,
  checker: TypeCheckerFn,
): RuntimeType<T> {
  const fn: RuntimeTypeFn<T> = (value) =>
    new RuntimeTypeLike(value, name, checker);
  return addDerive(name, checker, fn);
}
