import { Predicate } from "./predicate.ts";
import { TaggedWithValue, TaggedWithValueFactory } from "./tagged-type.ts";

/**
 *
 *
 * @template Arg
 * @template Tagname
 * @param {Predicate<Arg>} typeguard
 * @param {TaggedWithValueFactory<Tagname>} factory
 * @param {<X>(...args: any[]) => TaggedWithValue<X, Tagname>} failfactory
 */
export const createFilter = <
  Arg extends TaggedWithValue<any, Tagname>,
  Tagname extends string,
>(
  typeguard: Predicate<Arg>,
  factory: TaggedWithValueFactory<Tagname>,
  failfactory: <X>(...args: any[]) => TaggedWithValue<X, Tagname>,
) =>
  <T>(predicate: Predicate<T>) =>
    (result: TaggedWithValue<T, Tagname>) =>
      typeguard(result as Arg)
        ? predicate(result.value) ? factory(result.value) : failfactory()
        : failfactory();

/**
 *
 *
 * @template Arg
 * @template Tagname
 * @param {Predicate<Arg>} typeguard
 * @param {TaggedWithValueFactory<Tagname>} factory
 */
export const createFilterOr = <
  Arg extends TaggedWithValue<any, Tagname>,
  Tagname extends string,
>(
  typeguard: Predicate<Arg>,
  factory: TaggedWithValueFactory<Tagname>,
) =>
  <T>(fallback: TaggedWithValue<T, Tagname>, predicate: Predicate<T>) =>
    (result: TaggedWithValue<T, Tagname>) =>
      typeguard(result as Arg)
        ? predicate(result.value) ? factory(result.value) : fallback
        : fallback;
