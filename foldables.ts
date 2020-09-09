import { Predicate } from "./predicate.ts";
import { TaggedWithValue, TaggedWithValueFactory } from "./tagged-type.ts";

export type FoldableFn<T, R, Tagname extends string> = (
  arg: T,
) => TaggedWithValue<R, Tagname>;

/**
 * Creates a fold function
 * @template Tagname
 * @param {Predicate<TaggedWithValue<any, Tagname>>} lefthandpredicate
 */
export const createfold = <Tagname extends string>(
  lefthandpredicate: Predicate<TaggedWithValue<any, Tagname>>,
) =>
  <T, U, R>(left: (arg: T) => R, right: (arg: U) => R) =>
    <E extends TaggedWithValue<T | U, Tagname>>(arg: E) =>
      lefthandpredicate(arg) ? left(arg.value as T) : right(arg.value as U);

/**
 *
 *
 * @template LeftTag
 * @template RightTag
 * @param {(Predicate<TaggedWithValue<unknown, LeftTag | RightTag>>)} lefthandpredicate
 * @param {TaggedWithValueFactory<LeftTag>} leftcreator
 * @param {TaggedWithValueFactory<RightTag>} rightcreator
 */
export const createSwap = <LeftTag extends string, RightTag extends string>(
  lefthandpredicate: Predicate<TaggedWithValue<unknown, LeftTag | RightTag>>,
  leftcreator: TaggedWithValueFactory<LeftTag>,
  rightcreator: TaggedWithValueFactory<RightTag>,
) =>
  <T extends TaggedWithValue<any, LeftTag | RightTag>>(
    arg: T,
  ): T["__tag"] extends LeftTag ? TaggedWithValue<T["value"], RightTag>
    : TaggedWithValue<T["value"], LeftTag> =>
    lefthandpredicate(arg)
      ? rightcreator(arg.value)
      : leftcreator(arg.value) as any;
