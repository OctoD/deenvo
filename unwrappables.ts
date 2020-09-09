import { check } from "./applicative.ts";
import { Predicate } from "./predicate.ts";
import { TaggedWithValue } from "./tagged-type.ts";

/**
 *
 *
 * @template Tag
 * @param {Predicate<TaggedWithValue<any, Tag>>} predicate
 * @param {string} erromessage
 */
export const createUnwrap = <Tag extends string>(
  predicate: Predicate<TaggedWithValue<any, Tag>>,
  erromessage: string,
) =>
  <Arg extends TaggedWithValue<any, Tag>>(
    arg: Arg,
  ): Arg extends TaggedWithValue<infer U, Tag> ? U : never =>
    check(predicate(arg), erromessage)(arg.value);

/**
 *
 *
 * @template Tag
 * @param {Predicate<TaggedWithValue<any, Tag>>} predicate
 */
export const createUnwrapOr = <Tag extends string>(
  predicate: Predicate<TaggedWithValue<any, Tag>>,
) =>
  <U>(fallback: U) =>
    <Arg extends TaggedWithValue<any, Tag>>(arg: Arg): U =>
      predicate(arg) ? arg.value : fallback;

/**
 *
 *
 * @template Tag
 * @param {Predicate<TaggedWithValue<any, Tag>>} predicate
 */
export const createUnwrapOrElse = <Tag extends string>(
  predicate: Predicate<TaggedWithValue<any, Tag>>,
) =>
  <U>(fallback: () => U) =>
    <Arg extends TaggedWithValue<any, Tag>>(arg: Arg): U =>
      predicate(arg) ? arg.value : fallback();
