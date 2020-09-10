import { definetype } from "./applicative.ts";
import { createFilter, createFilterOr } from "./filterables.ts";
import { createfold, createSwap } from "./foldables.ts";
import { createMap, createMapOr, createMapOrElse } from "./mappables.ts";
import { Predicate } from "./predicate.ts";
import {
  createTaggedWithValue,
  isTagged,
  isTaggedWith,
  TaggedWithValue
} from "./tagged-type.ts";
import { anyof, combine, haskeyoftype, Typeguard } from "./typeguards.ts";
import {
  createUnwrap,
  createUnwrapOr,
  createUnwrapOrElse
} from "./unwrappables.ts";

//#region types

export const LEFTTAG = "left";
export const RIGHTTAG = "right";

export type LeftTagname = typeof LEFTTAG;
export type RightTagname = typeof RIGHTTAG;
export type EitherTagname = LeftTagname | RightTagname;

export interface Left<T = unknown> extends TaggedWithValue<T, LeftTagname> {}
export interface Right<T = unknown> extends TaggedWithValue<T, RightTagname> {}

export type LeftFactory = <T>(arg: T) => Left<T>;
export type RightFactory = <T>(arg: T) => Right<T>;

export type Either<TLeft = unknown, TRight = unknown> =
  | Left<TLeft>
  | Right<TRight>;

declare module "./applicative.ts" {
  interface TypesTable {
    readonly [LEFTTAG]: LeftFactory;
    readonly [RIGHTTAG]: RightFactory;
  }
}

//#endregion

//#region typeguards

const hasleftag = isTaggedWith(LEFTTAG) as Typeguard<Left>;
const hasrighttag = isTaggedWith(RIGHTTAG) as Typeguard<Right>;
const haseithertag = anyof<Left | Right>(hasleftag, hasrighttag);

export const isEither = combine<Either>(isTagged, haseithertag);
export const isLeft = combine<Left>(isTagged, hasleftag);
export const isRight = combine<Right>(isTagged, hasrighttag);
export const isEitherOf = <T>(typeguard: Typeguard<T>) =>
  combine(isEither, haskeyoftype("value", typeguard));
export const isLeftOf = <T>(typeguard: Typeguard<T>) =>
  combine(isLeft, haskeyoftype("value", typeguard));
export const isRightOf = <T>(typeguard: Typeguard<T>) =>
  combine(isRight, haskeyoftype("value", typeguard));

//#endregion

//#region ctors

export const left = <T>(value: T): Left<T> =>
  createTaggedWithValue(value, LEFTTAG);
export const right = <T>(value: T): Right<T> =>
  createTaggedWithValue(value, RIGHTTAG);

definetype(LEFTTAG, left);
definetype(RIGHTTAG, right);

//#endregion

//#region filterables

export const filterLeft = createFilter<Either, EitherTagname>(
  isLeft,
  left,
  right,
);

export const filterLeftOr = createFilterOr<Either, EitherTagname>(isLeft, left);

export const filterRight = createFilter<Either, EitherTagname>(
  isRight,
  right,
  left,
);

export const filterRightOr = createFilterOr<Either, EitherTagname>(
  isRight,
  right,
);

//#endregion

//#region foldables

export const fold = createfold<EitherTagname>(isLeft);
export const swap = createSwap<LeftTagname, RightTagname>(isLeft, left, right);

//#endregion

//#region mappables

export const mapLeft = createMap<Either, EitherTagname>(isLeft, left);
export const mapRight = createMap<Either, EitherTagname>(isRight, right);
export const mapLeftOr = createMapOr<Either, EitherTagname>(isLeft, left);
export const mapRightOr = createMapOr<Either, EitherTagname>(isRight, right);
export const mapLeftOrElse = createMapOrElse<Either, EitherTagname>(
  isLeft,
  left,
);
export const mapRigthOrElse = createMapOrElse<Either, EitherTagname>(
  isRight,
  right,
);

//#region unwrappables

export const unwrapEither = createUnwrap(isEither, "");
export const unwrapLeft = createUnwrap(
  isLeft,
  "Cannot unwrap Right, expected to be Left",
);
export const unwrapRight = createUnwrap(
  isRight,
  "Cannot unwrap Left, expected to be Right",
);
export const unwrapLeftOr = createUnwrapOr(isLeft);
export const unwrapRightOr = createUnwrapOr(isRight);
export const unwrapLeftOrElse = createUnwrapOrElse(isLeft);
export const unwrapRightOrElse = createUnwrapOrElse(isRight);

//#endregion

export const frompredicate = <T>(predicate: Predicate<T>) =>
  (arg: T) => predicate(arg) ? right(arg) : left(arg);
