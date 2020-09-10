import { check } from "./applicative.ts";
import { createExpect } from "./assertables.ts";
import { createFilter, createFilterOr } from "./filterables.ts";
import { createfold } from "./foldables.ts";
import { Predicate } from "./predicate.ts";
import {
  createTagged,
  isTagged,
  isTaggedWith,
  Tagged,
} from "./tagged-type.ts";
import { combine, anyof, Typeguard } from "./typeguards.ts";
import {
  createUnwrap,
  createUnwrapOr,
  createUnwrapOrElse,
} from "./unwrappables.ts";

//#region types

const JUSTTAG = "just";
const NOTHINGTAG = "nothing";

/**
 * 
 */
export type JustTag = typeof JUSTTAG;
/**
 * 
 */
export type NothingTag = typeof NOTHINGTAG;
/**
 * 
 */
export type MaybeTag = JustTag | NothingTag;

/**
 * 
 */
export interface Nothing extends Tagged<unknown, NothingTag> {}
/**
 * 
 */
export interface Just<T = unknown> extends Tagged<T, JustTag> {}

/**
 * 
 */
export type Maybe<T = unknown> = Nothing | Just<T>;

/**
 * 
 */
export type NothingFactory = () => Nothing;
/**
 * 
 */
export type JustFactory = <T>(value: T) => Just<T>;

//#endregion

//#region typeguards

const hasnothingtag = isTaggedWith(NOTHINGTAG) as Typeguard<Nothing>;
const hasjusttag = isTaggedWith(JUSTTAG) as Typeguard<Just>;

/**
 * 
 */
export const isMaybe = combine<Maybe>(
  isTagged,
  anyof(hasnothingtag, hasjusttag),
);
/**
 * 
 */
export const isJust = combine<Just>(isTagged, hasjusttag);
/**
 * 
 */
export const isNothing = combine<Nothing>(isTagged, hasnothingtag);

//#endregion

//#region factories

/**
 * 
 */
export const nothing = (): Nothing => createTagged(undefined, NOTHINGTAG);

/**
 * 
 */
export const just = <T>(value: T) =>
  check(!!value, "Just value must be truthy")(
    createTagged(value, JUSTTAG),
  );

/**
 * 
 */
export const maybe = <T>(arg?: T) => arg ? just(arg!) : nothing();

//#endregion

//#region assertable

/**
 * 
 */
export const expect = createExpect<Just>(isJust);
/**
 * 
 */
export const unexpect = createExpect<Nothing>(isNothing);

//#endregion

//#region filterables

/**
 * 
 */
export const filter = createFilter(isJust, just, nothing as any);
/**
 * 
 */
export const filterOr = createFilterOr(isJust, just);

//#endregion

//#region foldables

/**
 * 
 */
export const fold = createfold<MaybeTag>(isNothing);

//#endregion

//#region unwrappables

/**
 * 
 */
export const unwrap = createUnwrap<MaybeTag>(
  isJust,
  "Expected Just, got Nothing",
);
/**
 * 
 */
export const unwrapOr = createUnwrapOr<MaybeTag>(isJust);
/**
 * 
 */
export const unwrapOrElse = createUnwrapOrElse<MaybeTag>(isJust);

//#endregion

/**
 * 
 */
export const frompredicate = <T>(predicate: Predicate<T>) =>
  (arg: T) => predicate(arg) ? just(arg) : nothing();
