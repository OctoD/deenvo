import { FnBase } from "./applicative.ts";
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

export const isarray = ((arg) => Array.isArray(arg)) as Typeguard<unknown[]>;

export const isbigint = ((arg) => typeof arg === "bigint") as Typeguard<bigint>;

export const isboolean = ((arg) => typeof arg === "boolean") as Typeguard<
  boolean
>;

export const isdefined = ((arg) => typeof arg !== "undefined") as Typeguard<
  object
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

export const isnotnull = ((arg) => arg !== null) as Typeguard<object>;

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

export type TypeguardsFromStruct<T> = {
  [key in keyof T]: T[key] extends
    (number | string | boolean | null | undefined | unknown[])
    ? Typeguard<T[key]>
    : TypeguardsFromStruct<T[key]>;
};

/**
cle * Creates a typeguard representing a complex data structure. It is useful
 * for object validation.
 * 
 * @example
 * 
 * interface User {
 *    name: string;
 *    mail: string;
 *    age: number;
 *    status?: string;
 * }
 * 
 * const isUser = createStructOf<User>({
 *    name: isstring,
 *    mail: isstring,
 *    age: isnumber,
 *    status: optional(isstring),
 * });
 * 
 * isUser({}) // false
 * isUser({ age: 100 }) // false
 * isUser({ age: 100, name: 'foo' }) // false
 * isUser({ age: 100, name: 'foo', mail: 'hello_at_world.com' }) // true
 * isUser({ age: '100', name: 'foo', mail: 'hello_at_world.com' }) // false
 *
 * @template TG
 * @param {TG} typeguard
 */
export const createStructOf = <TG extends any>(
  typeguard: TypeguardsFromStruct<TG>,
) =>
  (value: unknown): value is TypeguardsStruct<TG> => {
    if (!isindexable(typeguard) || !isindexable(value)) {
      return false;
    }

    const keys = Object.keys(typeguard);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const currentvalue = value[key];

      if (!(key in value)) {
        return false;
      }

      const currenttg = typeguard[key as keyof typeof typeguard];
      const case1 = isindexable(currenttg) &&
        createStructOf(currenttg as any)(currentvalue);
      const case2 = isfunction(currenttg) && currenttg(currentvalue);

      if (case1 || case2) {
        continue;
      }

      return false;
    }

    return true;
  };

/**
 *
 *
 * @template TG
 * @param {...TG} typeguards
 */
export const createTupleOf = <TG extends Typeguard<any>[]>(
  ...typeguards: TG
) => {
  const tlength = haslengthof(typeguards.length);

  return (value: unknown): value is TypegardsTuple<TG> =>
    isarray(value) &&
    tlength(value) &&
    value.every((arg, index) => typeguards[index] && typeguards[index](arg));
};

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
export const anyof = <T>(
  ...predicates: Typeguard<unknown>[]
): Typeguard<T> => predicate.or.apply(null, predicates) as Typeguard<T>;

/**
 * Checks if a variable is null or undefined
 * 
 * @example
 * isnullOrUndefined(null)      // true
 * isnullOrUndefined(undefined) // true
 * isnullOrUndefined('foo')     // false
 * isnullOrUndefined([])        // false
 */
export const isnullOrUndefined = combine<null | undefined>(isnull, isundefined);

/**
 * Checks if a variable is not null or undefined
 * 
 * @example
 * isnotNullOrUndefined(null)      // false
 * isnotNullOrUndefined(undefined) // false
 * isnotNullOrUndefined('foo')     // true
 * isnotNullOrUndefined([])        // true
 */
export const isnotNullOrUndefined = combine<object>(isnotnull, isdefined);

/**
 * Checks if a variable is an array of a given type.
 * 
 * @example
 * const isarrayofStrings = isarrayof(isstring);
 * 
 * isarrayofStrings([10, 20, 'hello', 'world']) // false
 * isarrayofStrings([10, 20])                   // false
 * isarrayofStrings(['hello', 'world'])         // true
 *
 * @template T
 * @param {Typeguard<T>} typeguard
 */
export const isarrayof = <T>(typeguard: Typeguard<T>) =>
  (arg: unknown): arg is T[] => isarray(arg) && arg.every(typeguard);

/**
 * Makes a Typeguard<T> nullable
 * 
 * @example
 * const isnullablenumber = nullable(isnumber);
 * 
 * isnullablenumber(null) // true
 * isnullablenumber(1000) // true
 * isnullablenumber('10') // false
 *
 * @template T
 * @param {Typeguard<T>} typeguard
 */
export const nullable = <T>(typeguard: Typeguard<T>) =>
  anyof<T | null>(isnull, typeguard);

/**
 * Makes a Typeguard<T> optional
 * 
 * @example
 * const isoptionalnumber = optional(isnumber);
 * 
 * isoptionalnumber(undefined)  // true
 * isoptionalnumber(1000)       // true
 * isoptionalnumber('10')       // false
 * isoptionalnumber(null)       // false
 *
 * @template T
 * @param {Typeguard<T>} typeguard
 */
export const optional = <T>(typeguard: Typeguard<T>) =>
  anyof<T | undefined>(isundefined, typeguard);
