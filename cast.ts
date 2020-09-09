import {
  TaggedWithValue,
  TaggedWithValueFactory,
} from "./tagged-type.ts";

/**
 * Cast a TaggetType to another one.
 * 
 * @example
 * const error = err('this is an error');
 * const someError = cast(error, some);
 *
 * @template T
 * @template Tagfrom
 * @template Tagto
 * @param {T} tagged
 * @param {TaggedWithValueFactory<Tagto>} totagged
 * @returns {TaggedWithValue<T['value'], Tagto>}
 */
export const cast = <
  T extends TaggedWithValue<any, Tagfrom>,
  Tagfrom extends string,
  Tagto extends string,
>(
  tagged: T,
  totagged: TaggedWithValueFactory<Tagto>,
): TaggedWithValue<T["value"], Tagto> => totagged(tagged.value);

/**
 * Creates a cast to function
 * 
 * @example
 * 
 * const toOption = createCast(option);
 * 
 * toOption(just('hello')); // Some<'hello'>;
 *
 * @template Tagto
 * @param {TaggedWithValueFactory<Tagto>} totagged
 */
export const createCast = <Tagto extends string>(
  totagged: TaggedWithValueFactory<Tagto>,
) =>
  <T extends TaggedWithValue<any, Tagfrom>, Tagfrom extends string>(
    arg: T,
  ): TaggedWithValue<T["value"], Tagto> => totagged(arg.value);
