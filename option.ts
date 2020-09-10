import {
  check,
  definetype,
} from "./applicative.ts";
import { createExpect } from "./assertables.ts";
import { createFilter, createFilterOr } from "./filterables.ts";
import { createMap, createMapOr, createMapOrElse } from "./mappables.ts";
import {
  createTaggedWithValue,
  isTagged,
  isTaggedWith,
  TaggedWithValue,
} from "./tagged-type.ts";
import * as typeguardsTs from "./typeguards.ts";
import {
  createUnwrap,
  createUnwrapOr,
  createUnwrapOrElse,
} from "./unwrappables.ts";

//#region types

const NONETAG = "none";
const SOMETAG = "some";
const OPTIONTAG = "option";

/**
 * 
 */
export type Nonetag = typeof NONETAG;
/**
 * 
 */
export type Sometag = typeof SOMETAG;
/**
 * 
 */
export type Optiontag = Nonetag | Sometag;

/**
 * 
 */
export interface None extends TaggedWithValue<any, Nonetag> {}

/**
 * 
 */
export interface Some<T = unknown> extends TaggedWithValue<T, Sometag> {}

/**
 * 
 */
export type Option<T = unknown> = None | Some<T>;

/**
 * 
 */
export type NoneFactory = () => None;
/**
 * 
 */
export type SomeFactory = <T>(value: T) => Some;
/**
 * 
 */
export type OptionFactory = <T>(value: T) => Option<T>;

declare module "./applicative.ts" {
  interface TypesTable {
    readonly [NONETAG]: NoneFactory;
    readonly [SOMETAG]: SomeFactory;
    readonly [OPTIONTAG]: OptionFactory;
  }
}

//#endregion

//#region typeguards

const hasnonetag = isTaggedWith(NONETAG) as typeguardsTs.Typeguard<None>;
const hassometag = isTaggedWith(SOMETAG) as typeguardsTs.Typeguard<Some>;
const hasoptiontag = typeguardsTs.anyof<Option>(hasnonetag, hassometag);

/**
 * 
 */
export const isOption = typeguardsTs.combine<Option>(isTagged, hasoptiontag);
/**
 * 
 */
export const isNone = typeguardsTs.combine<None>(isTagged, hasnonetag);
/**
 * 
 */
export const isSome = typeguardsTs.combine<Some>(isTagged, hassometag);
/**
 * 
 */
export const isOptionOf = <T>(typeguard: typeguardsTs.Typeguard<T>) =>
  typeguardsTs.combine<Option<T>>(
    isOption,
    typeguardsTs.haskeyoftype("value", typeguard),
  );

//#endregion

//#region assertables

/**
 * 
 */
export const expect = createExpect<Option>(isSome);
/**
 * 
 */
export const unexpect = createExpect<Option>(isNone);

//#endregion

//#region factories

/**
 * 
 */
export const none = (): None => createTaggedWithValue(void 0, NONETAG);

/**
 * 
 */
export const some = <T>(value: T): Some<T> =>
  check(
    !typeguardsTs.isnullOrUndefined(value),
    "some value cannot be undefined nor null",
  )(createTaggedWithValue(value, SOMETAG));

/**
 * 
 */
export const option = <T>(value: T): Option<T> =>
  typeguardsTs.isnullOrUndefined(value) ? none() : some(value);

definetype(NONETAG, none);
definetype(SOMETAG, some);
definetype(OPTIONTAG, option);

//#endregion

//#region filterables

/**
 * 
 */
export const filter = createFilter<Option, Optiontag>(isSome, some, none);
/**
 * 
 */
export const filterOr = createFilterOr<Option, Optiontag>(isSome, some);

//#endregion

//#region mappables

/**
 * 
 */
export const map = createMap<Option, Optiontag>(isSome, option);
/**
 * 
 */
export const mapOr = createMapOr<Option, Optiontag>(isSome, option);
/**
 * 
 */
export const mapOrElse = createMapOrElse<Option, Optiontag>(isSome, option);

//#endregion

//#region unwrappables

/**
 * 
 */
export const unwrap = createUnwrap<Optiontag>(
  isSome,
  "option.unwrap argument must be some",
);

/**
 * 
 */
export const unwrapOr = createUnwrapOr<Optiontag>(isSome);

/**
 * 
 */
export const unwrapOrElse = createUnwrapOrElse<Optiontag>(isSome);

//#endregion
