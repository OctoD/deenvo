import {
  check,
  definetype
} from "./applicative.ts";
import { createExpect } from "./assertables.ts";
import { createFilter, createFilterOr } from "./filterables.ts";
import { createMap, createMapOr, createMapOrElse } from "./mappables.ts";
import {
  createTaggedWithValue,
  isTagged,
  isTaggedWith,
  TaggedWithValue,
  TaggedWithValueFactory
} from "./tagged-type.ts";
import * as tg from "./typeguards.ts";
import {
  createUnwrap,
  createUnwrapOr,
  createUnwrapOrElse
} from "./unwrappables.ts";

//#region types

const ERRTAG = "err";
const OKTAG = "ok";
const RESULTTAG = "result";

export type Errtag = typeof ERRTAG;

export type Oktag = typeof OKTAG;

export type ResultTag = Errtag | Oktag;

export interface Err extends TaggedWithValue<Error, Errtag> {}

export interface Ok<T = unknown> extends TaggedWithValue<T, Oktag> {}

export type Result<T = unknown> = Ok<T> | Err;

export type ErrFactory = (message: string | Error) => Err;
export type OkFactory = <T>(arg: T) => Ok<T>;
export type ResultFactory = <T>(arg: T) => Result<T>;

declare module "./applicative.ts" {
  interface TypesTable {
    readonly [ERRTAG]: ErrFactory;
    readonly [OKTAG]: OkFactory;
    readonly [RESULTTAG]: ResultFactory;
  }
}

//#endregion

//#region typeguards

const hasoktag = isTaggedWith(OKTAG);
const haserrtag = isTaggedWith(ERRTAG);
const hasresulttag = tg.anyof(hasoktag, haserrtag);

export const isResult = tg.combine(isTagged, hasresulttag) as tg.Typeguard<
  Result
>;
export const isErr = tg.combine(isTagged, haserrtag) as tg.Typeguard<Err>;
export const isOk = tg.combine(isTagged, hasoktag) as tg.Typeguard<Ok>;

//#endregion

//#region factories

export const err = (message: string | Error): Err =>
  createTaggedWithValue(
    message instanceof Error ? message : new Error(message),
    ERRTAG,
  );

export const ok = <T>(value: T): Ok<T> =>
  createTaggedWithValue(
    check(!tg.iserror(value), "An error cannot be a value of Ok")(value),
    OKTAG,
  );

export const result = <T>(value: T): Result<T> =>
  tg.iserror(value) ? err(value) : ok(value);

definetype(RESULTTAG, result);
definetype(ERRTAG, err);
definetype(OKTAG, ok);

//#endregion

//#region assertables

export const expect = createExpect<Result>(isOk);
export const unexpect = createExpect<Result>(isErr);

//#endregion

//#region filterables

export const filter = createFilter<Result, ResultTag>(
  isOk,
  result as TaggedWithValueFactory<ResultTag>,
  () => err("filter error") as any,
);

export const filterOr = createFilterOr<Result, ResultTag>(
  isOk,
  result as TaggedWithValueFactory<ResultTag>,
);

//#endregion

//#region mappables

export const map = createMap<Result, ResultTag>(
  isOk,
  result as TaggedWithValueFactory<ResultTag>,
);

export const mapOr = createMapOr<Result, ResultTag>(
  isOk,
  result as TaggedWithValueFactory<ResultTag>,
);

export const mapOrElse = createMapOrElse<Result, ResultTag>(
  isOk,
  result as TaggedWithValueFactory<ResultTag>,
);

//#endregion

//#region unwrappable

export const unwrap = createUnwrap<ResultTag>(isOk, "cannot unwrapp Err");
export const unwrapOr = createUnwrapOr<ResultTag>(isOk);
export const unwrapOrElse = createUnwrapOrElse<ResultTag>(isOk);

//#endregion
