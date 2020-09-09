import { _ } from "./applicative.ts";
import { Predicate } from "./predicate.ts";
import { TaggedWithValue, TaggedWithValueFactory } from "./tagged-type.ts";

export type MapFn<T, U> = T extends null | undefined ? () => U : (arg: T) => U;

/**
 *
 *
 * @template K
 * @template Tagname
 * @param {Predicate<K>} predicate
 * @param {TaggedWithValueFactory<Tagname>} creator
 */
export const createMap = <
  K extends TaggedWithValue<any, Tagname>,
  Tagname extends string,
>(predicate: Predicate<K>, creator: TaggedWithValueFactory<Tagname>) =>
  <T, U>(fn: MapFn<T, U>) =>
    (arg: TaggedWithValue<T, Tagname>): TaggedWithValue<T | U, Tagname> =>
      predicate(arg as K) ? creator(fn(arg.value)) : arg;

/**
 *
 *
 * @template K
 * @template Tagname
 * @param {Predicate<K>} predicate
 * @param {TaggedWithValueFactory<Tagname>} creator
 */
export const createMapOr = <
  K extends TaggedWithValue<any, Tagname>,
  Tagname extends string,
>(predicate: Predicate<K>, creator: TaggedWithValueFactory<Tagname>) =>
  <T, U>(fallback: TaggedWithValue<U, Tagname>, fn: MapFn<T, U>) =>
    (arg: TaggedWithValue<T, Tagname>): TaggedWithValue<U, Tagname> =>
      predicate(arg as K) ? creator(fn(arg.value)) : fallback;

/**
 *
 *
 * @template K
 * @template Tagname
 * @param {Predicate<K>} predicate
 * @param {TaggedWithValueFactory<Tagname>} creator
 */
export const createMapOrElse = <
  K extends TaggedWithValue<any, Tagname>,
  Tagname extends string,
>(predicate: Predicate<K>, creator: TaggedWithValueFactory<Tagname>) =>
  <T, U>(fallback: MapFn<_, U>, fn: MapFn<T, U>) =>
    (arg: TaggedWithValue<T, Tagname>): TaggedWithValue<U, Tagname> =>
      predicate(arg as K) ? creator(fn(arg.value)) : creator(fallback());
