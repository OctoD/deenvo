import {
  combine,
  haskey,
  haskeyoftype,
  haskeyWithValue,
  isindexable,
  isstring,
  Typeguard,
} from "./typeguards.ts";

/**
 * 
 */
export type Tagged<Tagname extends string> = { readonly __tag: Tagname };

/**
 * 
 */
export type TaggedWithValue<T, Tagname extends string> =
  & { readonly value: T }
  & Tagged<Tagname>;

/**
 * 
 */
export type TaggedFactory<Tagname extends string> = () => Tagged<Tagname>;

/**
 * 
 */
export type TaggedWithValueFactory<Tagname extends string> = <T>(
  arg: T,
) => TaggedWithValue<T, Tagname>;

const hastag = haskey("__tag");
const hasvalue = haskey("value");

/**
 *
 *
 * @template T
 * @template Tagname
 * @param {T} value
 * @param {Tagname} tagname
 * @returns {TaggedWithValue<T, Tagname>}
 */
export const createTaggedWithValue = <T, Tagname extends string>(
  value: T,
  tagname: Tagname,
): TaggedWithValue<T, Tagname> => ({ __tag: tagname, value });

/**
 * 
 * @param tagname 
 */
export const createTaggedWithValueFactory = <T extends string>(
  tagname: T,
): TaggedWithValueFactory<T> =>
  <K>(arg: K) =>
    createTaggedWithValue(arg, tagname) as unknown as TaggedWithValue<K, T>;

const _isTagged = combine(
  hastag,
  haskeyoftype("__tag", isstring),
) as Typeguard<Tagged<any>>;

/**
 * 
 * 
 * @type {Typeguard<TaggedWithValue<any, any>>}
 */
export const isTagged = combine(isindexable, hasvalue, _isTagged) as Typeguard<
  TaggedWithValue<any, any>
>;

/**
 *
 *
 * @template Tag
 * @param {Tag} tag
 */
export const isTaggedWith = <Tag extends string>(tag: Tag) =>
  combine(
    isindexable,
    hasvalue,
    _isTagged,
    haskeyWithValue("__tag", tag),
  ) as Typeguard<TaggedWithValue<any, Tag>>;

/**
 *
 *
 * @template Tag
 * @template T
 * @param {Tag} tag
 * @param {Typeguard<T>} typeguard
 */
export const isTaggedWithValueOf = <Tag extends string, T>(
  tag: Tag,
  typeguard: Typeguard<T>,
) =>
  combine(
    isindexable,
    hasvalue,
    _isTagged,
    haskeyWithValue("__tag", tag),
    haskeyoftype("value", typeguard),
  ) as Typeguard<TaggedWithValue<T, Tag>>;
