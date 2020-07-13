import { ensureFn } from './common.ts';
import { IImmediateComparisonConditional } from "./IConditional.ts";
import { FilterableFn } from "./IFilterable.ts";
import {
  IComputedMappable,
  IImmediateMappable,
  MappableFn,
} from "./IMappable.ts";
import { UnwrappableFn } from "./IUnwrappable.ts";
import {
  IAssertable,
  IFilterable,
  IUnwrappable,
  just,
  Maybe,
  nothing,
  IInsertable,
} from "./mod.ts";
import { none, Option, some } from "./option.ts";
import { err, ok, Result } from "./result.ts";

export class ListLike<T>
  implements
    IAssertable<T>,
    IImmediateComparisonConditional<T>,
    IImmediateMappable<T>,
    IInsertable<T>,
    IComputedMappable<T>,
    IFilterable<T>,
    IUnwrappable<T[]> {
  public constructor(protected _args: T[]) {}

  /**
   * If is filled, returns `other` otherwise returns `ListLike<T>`
   *
   * @template U
   * @param {List<U>} other
   * @returns {(List<T | U>)}
   * @memberof ListLike
   */
  public and<U>(other: List<U>): List<T | U> {
    return this.isFilled() ? other : this;
  }

  /**
   * If is filled, returns `ListLike<T>` otherwise throws
   *
   * @param {string} [errormessage="List is empty"]
   * @returns {List<T>}
   * @memberof ListLike
   */
  public expect(errormessage: string = "List is empty"): List<T> {
    if (this.isEmpty()) {
      throw new Error(errormessage);
    }

    return this;
  }

  /**
   * Returns a subset `ListLike<T>` filtered by `fn`
   *
   * @param {FilterableFn<T>} fn
   * @returns {List<T>}
   * @memberof ListLike
   */
  public filter(fn: FilterableFn<T>): List<T> {
    ensureFn(fn, 'List.filter fn argument must be a function');
    return this.isFilled() ? new ListLike(this._args.filter(fn)) : this;
  }

  /**
   * Returns a subset `ListLike<T>` filtered by `fn`. If the filtered result is filled, returns it, otherwise returns `def`
   *
   * @param {List<T>} def
   * @param {FilterableFn<T>} fn
   * @returns {List<T>}
   * @memberof ListLike
   */
  public filterOr(def: List<T>, fn: FilterableFn<T>): List<T> {
    ensureFn(fn, 'List.filterOr fn argument must be a function');
    if (this.isFilled()) {
      const result = this._args.filter(fn);
      return result.length > 0 ? new ListLike(result) : def;
    }

    return def;
  }

  /**
   * Inserts a value `T`
   *
   * @param {T} item
   * @returns {List<T>}
   * @memberof ListLike
   */
  public insert(item: T): List<T> {
    return new ListLike(this._args.concat(item));
  }

  /**
   * Returns `true` if the `List<T>` is empty
   *
   * @returns {boolean}
   * @memberof ListLike
   */
  public isEmpty(): boolean {
    return this._args.length === 0;
  }

  /**
   * Returns `true` if the `List<T>` has a least one value stored
   *
   * @returns {boolean}
   * @memberof ListLike
   */
  public isFilled(): boolean {
    return this._args.length !== 0;
  }

  /**
   * Returns `List<T>` length
   *
   * @returns {number}
   * @memberof ListLike
   */
  public len(): number {
    return this._args.length;
  }

  /**
   * Maps `List<T>` to `List<U>` using fn
   *
   * @template U
   * @param {MappableFn<T, U>} fn
   * @returns {(List<T | U>)}
   * @memberof ListLike
   */
  public map<U>(fn: MappableFn<T, U>): List<T | U> {
    ensureFn(fn, 'List.map fn argument must be a function');
    return this.isFilled() ? new ListLike(this._args.map(fn)) : this;
  }

  /**
   * Maps `List<T>` to `List<U>` using `fn` if is filled, otherwise returns `def`
   *
   * @template U
   * @param {List<U>} def
   * @param {MappableFn<T, U>} fn
   * @returns {(List<T | U>)}
   * @memberof ListLike
   */
  public mapOr<U>(def: List<U>, fn: MappableFn<T, U>): List<U> {
    ensureFn(fn, 'List.mapOr fn argument must be a function');
    return this.isFilled() ? new ListLike(this._args.map(fn)) : def;
  }

  /**
   * If is filled, returns `Just<T[]>`, otherwise returns `Nothing`;
   *
   * @returns {Maybe<T[]>}
   * @memberof ListLike
   */
  public maybe(): Maybe<T[]> {
    return this.isFilled() ? just(this._args) : nothing();
  }

  /**
   * If is filled, returns `Option<T[]>`, otherwise returns `None`;
   *
   * @returns {Option<T[]>}
   * @memberof ListLike
   */
  public option(): Option<T[]> {
    return this.isFilled() ? some(this._args) : none();
  }

  /**
   * Returns `List<T>` if is filled, otherwise returns `List<U>`
   *
   * @template U
   * @param {List<U>} other
   * @returns {(List<T | U>)}
   * @memberof ListLike
   */
  public or<U>(other: List<U>): List<T | U> {
    return this.isFilled() ? this : other;
  }

  /**
   * Removes all values equal to `value`
   *
   * @param {T} value
   * @returns {List<T>}
   * @memberof ListLike
   */
  public remove(value: T): List<T> {
    return this.filter((a) => a !== value);
  }

  /**
   * If is filled, returns `Ok<T[]>`, otherwise returns `Err`;
   *
   * @param {string} [errmessage="Empty list provided"]
   * @returns {Result<T[]>}
   * @memberof ListLike
   */
  public result(errmessage = "Empty list provided"): Result<T[]> {
    return this.isFilled() ? ok(this._args) : err(errmessage);
  }

  /**
   * Throws if is filled, otherwise returns `List<T>`
   *
   * @param {string} [errormessage="List if filled"]
   * @returns {List<T>}
   * @memberof ListLike
   */
  public unexpect(errormessage: string = "List if filled"): List<T> {
    if (this.isFilled()) {
      throw new Error(errormessage);
    }

    return this;
  }

  /**
   * Always unwrap `T[]`. If it is empty, throws
   *
   * @returns {T[] | never}
   * @memberof ListLike
   */
  public unwrap(errormessage = "List is empty"): T[] | never {
    if (this.isEmpty()) {
      throw new Error(errormessage);
    }

    return this._args;
  }

  /**
   * Unwraps `T[]` if is filled, otherwise returns `def`
   *
   * @param {T[]} def
   * @returns {T[]}
   * @memberof ListLike
   */
  public unwrapOr(def: T[]): T[] {
    return this.isFilled() ? this._args : def;
  }

  /**
   * Unwraps `T[]` if is filled, otherwise calls `defFn` and returns it's value
   *
   * @param {UnwrappableFn<T[]>} fn
   * @returns {T[]}
   * @memberof ListLike
   */
  public unwrapOrElse(fn: UnwrappableFn<T[]>): T[] {
    ensureFn(fn, 'List.unwrapOrElse fn argument must be a function');
    return this.isFilled() ? this._args : fn();
  }
}

export type List<T> = ListLike<T>;

/**
 * Creates a List<T>
 *
 * @export
 * @template T
 * @param {...T[]} args
 * @returns {List<T>}
 */
export function list<T>(...args: T[]): List<T> {
  return new ListLike<T>(args) as List<T>;
}
