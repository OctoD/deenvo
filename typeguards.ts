import { check, FnBase } from "./applicative.ts";
import * as predicate from "./predicate.ts";

//#region types

export type Typeguard<IsOutput> = (arg: unknown) => arg is IsOutput;

export type IndexableObject<T = unknown> = { [index: string]: T };

export type WithLength = { length: number };

export type TypeguardsStruct<T> = {
  [key in keyof T]: T[key] extends Typeguard<infer U> ? U
    : T[key] extends IndexableObject<any> ? TypeguardsStruct<T[key]>
    : never;
};

export type TypegardsTuple<T extends Typeguard<any>[]> = {
  [key in keyof T]: T[key] extends Typeguard<infer U> ? U : never;
};

//#endregion

//#region primitives

export const isarray = ((arg) => Array.isArray(arg)) as Typeguard<any[]>;

export const isbigint = ((arg) => typeof arg === "bigint") as Typeguard<bigint>;

export const isboolean = ((arg) => typeof arg === "boolean") as Typeguard<
  boolean
>;

export const isfunction = ((arg) => typeof arg === "function") as Typeguard<
  FnBase
>;

export const isnumber = ((arg) => typeof arg === "number") as Typeguard<number>;

export const isobject = ((arg) => typeof arg === "object") as Typeguard<object>;

export const isstring = ((arg) => typeof arg === "string") as Typeguard<string>;

export const isundefined = ((arg) => typeof arg === "undefined") as Typeguard<
  undefined
>;

export const isnull = ((arg) => arg === null) as Typeguard<null>;

//#endregion

//#region derived from isobject

export const isindexable =
  ((arg) => isobject(arg) && arg !== null) as Typeguard<
    { [index: string]: unknown }
  >;

/**
 *
 *
 * @param {unknown} arg
 * @returns {arg is Error}
 */
export const iserror = (arg: unknown): arg is Error => arg instanceof Error;

//#endregion

//#region indexables

/**
 *
 *
 * @template Key
 * @param {Key} key
 */
export const haskey = <Key extends (string | number)>(
  key: Key,
) =>
  (arg: unknown): arg is Record<Key, unknown> => isindexable(arg) && key in arg;

/**
 *
 *
 * @template Key
 * @template T
 * @param {Key} key
 * @param {Typeguard<T>} typeguard
 */
export const haskeyoftype = <Key extends (string | number), T>(
  key: Key,
  typeguard: Typeguard<T>,
) =>
  (arg: unknown): arg is Record<Key, T> =>
    isindexable(arg) && key in arg && typeguard(arg[key]);

/**
 *
 *
 * @template Key
 * @template Value
 * @param {Key} key
 * @param {Value} value
 */
export const haskeyWithValue = <Key extends (string | number), Value>(
  key: Key,
  value: Value,
) =>
  (arg: unknown): arg is Record<Key, Value> =>
    isindexable(arg) && key in arg && arg[key] === value;

/**
 *
 *
 * @param {unknown} arg
 * @returns {arg is WithLength}
 */
export const haslength = (arg: unknown): arg is WithLength =>
  !isnullOrUndefined(arg) && haskey("length")(arg);

/**
 *
 *
 * @param {number} length
 */
export const haslengthof = (length: number) =>
  (arg: unknown): arg is WithLength => haslength(arg) && arg.length === length;

//#endregion

//#region typeguards factories

/**
 *
 *
 * @template TG
 * @param {TG} typeguard
 */
export const createStructOf = <TG extends any>(typeguard: TG) =>
  (value: unknown): value is TypeguardsStruct<TG> => {
    if (isindexable(typeguard) && isindexable(value)) {
      const keys = Object.keys(typeguard);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const currentvalue = value[key];

        if (!(key in value)) {
          return false;
        }

        if (isindexable(key)) {
          const tg = createStructOf((typeguard as any)[key]);

          if (tg(currentvalue)) {
            continue;
          }

          return false;
        } else if (isfunction(currentvalue)) {
          if ((typeguard as any)[key](currentvalue)) {
            continue;
          }

          return false;
        }
      }

      return true;
    } else {
      return false;
    }
  };

/**
 *
 *
 * @template TG
 * @param {...TG} typeguards
 */
export const createTupleOf = <TG extends Typeguard<any>[]>(...typeguards: TG) =>
  (value: unknown): value is TypegardsTuple<TG> =>
    isarray(value) &&
    value.length === typeguards.length &&
    value.every((arg, index) => typeguards[index] && typeguards[index](arg));

//#endregion

/**
 *
 *
 * @template T
 * @param {...Typeguard<T>[]} args
 * @returns {Typeguard<T>}
 */
export const combine = <T>(...args: Typeguard<any>[]): Typeguard<T> =>
  predicate.and.apply(null, args) as Typeguard<T>;

/**
 *
 *
 * @template T
 * @param {...Typeguard<unknown>[]} predicates
 * @returns {Typeguard<T>}
 */
export const or = <T>(
  ...predicates: Typeguard<unknown>[]
): Typeguard<T> => predicate.or.apply(null, predicates) as Typeguard<T>;

/**
 * 
 */
export const isnullOrUndefined = combine(isnull, isundefined);

/**
 *
 *
 * @template T
 * @param {Typeguard<T>} typeguard
 */
export const isarrayof = <T>(typeguard: Typeguard<T>) =>
  (arg: unknown): arg is T[] => isarray(arg) && arg.every(typeguard);
