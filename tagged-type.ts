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

const _isTagged = combine<Tagged<any>>(
  hastag,
  haskeyoftype("__tag", isstring),
);

/**
 * 
 * 
 * @type {Typeguard<TaggedWithValue<any, any>>}
 */
export const isTagged = combine<TaggedWithValue<any, any>>(
  isindexable,
  hasvalue,
  _isTagged,
);

/**
 *
 *
 * @template Tag
 * @param {Tag} tag
 */
export const isTaggedWith = <Tag extends string>(tag: Tag) =>
  combine<TaggedWithValue<any, Tag>>(
    isindexable,
    hasvalue,
    _isTagged,
    haskeyWithValue("__tag", tag),
  );

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
  combine<TaggedWithValue<T, Tag>>(
    isindexable,
    hasvalue,
    _isTagged,
    haskeyWithValue("__tag", tag),
    haskeyoftype("value", typeguard),
  );
