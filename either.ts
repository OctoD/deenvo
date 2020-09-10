import { createFilter, createFilterOr } from "./filterables.ts";
import { createfold, createSwap } from "./foldables.ts";
import { createMap, createMapOr, createMapOrElse } from "./mappables.ts";
import { Predicate } from "./predicate.ts";
import {
  createTagged,
  isTagged,
  isTaggedWith,
  Tagged,
} from "./tagged-type.ts";
import { anyof, combine, haskeyoftype, Typeguard } from "./typeguards.ts";
import {
  createUnwrap,
  createUnwrapOr,
  createUnwrapOrElse,
} from "./unwrappables.ts";

//#region types

const LEFTTAG = "left";
const RIGHTTAG = "right";

/**
 * Left tagtype
 */
export type LeftTagname = typeof LEFTTAG;
/**
 * Right tagtype
 */
export type RightTagname = typeof RIGHTTAG;
/**
 * Left or Right tagtypes
 */
export type EitherTagname = LeftTagname | RightTagname;

/**
 * Represents a value of one of two possible types (a disjoint union).
 */
export interface Left<T = unknown> extends Tagged<T, LeftTagname> {}
/**
 * Represents a value of one of two possible types (a disjoint union).
 */
export interface Right<T = unknown> extends Tagged<T, RightTagname> {}

/**
 * Represents a value of one of two possible types (a disjoint union).
 */
export type Either<TLeft = unknown, TRight = unknown> =
  | Left<TLeft>
  | Right<TRight>;

//#endregion

//#region typeguards

const hasleftag = isTaggedWith(LEFTTAG) as Typeguard<Left>;
const hasrighttag = isTaggedWith(RIGHTTAG) as Typeguard<Right>;
const haseithertag = anyof<Left | Right>(hasleftag, hasrighttag);

/**
 * Checks if a variable is Either
 */
export const isEither = combine<Either>(isTagged, haseithertag);

/**
 * Checks if a variable is Left
 */
export const isLeft = combine<Left>(isTagged, hasleftag);

/**
 * Checks if a variable is Right
 */
export const isRight = combine<Right>(isTagged, hasrighttag);

/**
 * Checks if a variable is Either with a value of a given type
 * 
 * @example
 * const test1 = left(10);
 * const test2 = right(10);
 * const iseitherofstring = isEitherOf(isstring);
 * const iseitherofnumber = isEitherOf(isnumber);
 * 
 * iseitherofstring(test) // false
 * iseitherofnumber(test) // true
 *
 * @template T
 * @param {Typeguard<T>} typeguard
 */
export const isEitherOf = <T>(typeguard: Typeguard<T>) =>
  combine(isEither, haskeyoftype("value", typeguard));

/**
 * Checks if a variable is Left with a value of a given type
 * 
 * @example
 * const test1 = left(10);
 * const test2 = right(10);
 * const isleftofstring = isLeftOf(isstring);
 * const isleftofnumber = isLeftOf(isnumber);
 * 
 * isleftofstring(test1) // false
 * isleftofstring(test2) // false
 * isleftofnumber(test1) // true
 * isleftofnumber(test2) // false
 *
 * @template T
 * @param {Typeguard<T>} typeguard
 */
export const isLeftOf = <T>(typeguard: Typeguard<T>) =>
  combine(isLeft, haskeyoftype("value", typeguard));

/**
 * Checks if a variable is Right with a value of a given type
 * 
 * @example
 * const test1 = left(10);
 * const test2 = right(10);
 * const isrightofstring = isRightOf(isstring);
 * const isrightofnumber = isRightOf(isnumber);
 * 
 * isrightofstring(test1) // false
 * isrightofstring(test2) // false
 * isrightofnumber(test1) // false
 * isrightofnumber(test2) // true
 *
 * @template T
 * @param {Typeguard<T>} typeguard
 */
export const isRightOf = <T>(typeguard: Typeguard<T>) =>
  combine(isRight, haskeyoftype("value", typeguard));

//#endregion

//#region ctors

/**
 * Creates a Left<T> type
 */
export const left = <T>(value: T): Left<T> => createTagged(value, LEFTTAG);
/**
 * Creates a Right<T> type
 */
export const right = <T>(value: T): Right<T> => createTagged(value, RIGHTTAG);

//#endregion

//#region filterables

/**
 * 
 */
export const filterLeft = createFilter<Either, EitherTagname>(
  isLeft,
  left,
  right,
);

/**
 * 
 */
export const filterLeftOr = createFilterOr<Either, EitherTagname>(isLeft, left);

/**
 * 
 */
export const filterRight = createFilter<Either, EitherTagname>(
  isRight,
  right,
  left,
);

/**
 * 
 */
export const filterRightOr = createFilterOr<Either, EitherTagname>(
  isRight,
  right,
);

//#endregion

//#region foldables

/**
 * 
 */
export const fold = createfold<EitherTagname>(isLeft);
/**
 * 
 */
export const swap = createSwap<LeftTagname, RightTagname>(isLeft, left, right);

//#endregion

//#region mappables

/**
 * 
 */
export const mapLeft = createMap<Either, EitherTagname>(isLeft, left);
/**
 * 
 */
export const mapRight = createMap<Either, EitherTagname>(isRight, right);
/**
 * 
 */
export const mapLeftOr = createMapOr<Either, EitherTagname>(isLeft, left);
/**
 * 
 */
export const mapRightOr = createMapOr<Either, EitherTagname>(isRight, right);
/**
 * 
 */
export const mapLeftOrElse = createMapOrElse<Either, EitherTagname>(
  isLeft,
  left,
);
/**
 * 
 */
export const mapRigthOrElse = createMapOrElse<Either, EitherTagname>(
  isRight,
  right,
);

//#region unwrappables

/**
 * 
 */
export const unwrapEither = createUnwrap(isEither, "");
/**
 * 
 */
export const unwrapLeft = createUnwrap(
  isLeft,
  "Cannot unwrap Right, expected to be Left",
);
/**
 * 
 */
export const unwrapRight = createUnwrap(
  isRight,
  "Cannot unwrap Left, expected to be Right",
);
/**
 * 
 */
export const unwrapLeftOr = createUnwrapOr(isLeft);
/**
 * 
 */
export const unwrapRightOr = createUnwrapOr(isRight);
/**
 * 
 */
export const unwrapLeftOrElse = createUnwrapOrElse(isLeft);
/**
 * 
 */
export const unwrapRightOrElse = createUnwrapOrElse(isRight);

//#endregion

/**
 * 
 */
export const frompredicate = <T>(predicate: Predicate<T>) =>
  (arg: T) => predicate(arg) ? right(arg) : left(arg);
