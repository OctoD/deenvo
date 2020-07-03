import {
  assertEquals,
  assert,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { none, option, some } from "../option.ts";

Deno.test("option.IAssertable", () => {
  assertThrows(() => option(10).unexpect(""));
  assertThrows(() => none().expect("kablomblo"));
  assertThrows(() => none().unwrap());
  assertThrows(() => some(null));
});

Deno.test("option.IConditional", () => {
  //#region conditional
  assertEquals(
    option(10).and(option(20)).unwrap(),
    20,
    "option.and fails with option(10).and(option(20)) === 200",
  );
  assertEquals(
    option(10).and(option(null)).unwrapOr(200),
    200,
    "option.and fails with option(10).and(option(null)).unwrapOr(200) === 200",
  );
  assertEquals(
    option(null).and(option(null)).unwrapOr(null),
    null,
    "option.and fails with option(null).and(option(null)) === 200",
  );
  assertEquals(
    option(10).andThen((value) => value * 20).unwrap(),
    200,
    "option.andThen option(10).andThen(value => value * 20).unwrap() === 200",
  );
  assertEquals(
    option(null).andThen(() => 10).unwrapOr(200),
    200,
    "option.andThen option(null).andThen(() => 10).unwrapOr(200) === 200",
  );
  assertEquals(
    option(null).andThen(() => null).unwrapOr(null),
    null,
    "option.andThen option(null).andThen(() => null).unwrap() === null",
  );
  assertEquals(
    option(10).or(option(20)).unwrap(),
    10,
    "option.or fails with option(10).or(option(20)) === 20",
  );
  assertEquals(
    option(10).or(option(null)).unwrapOr(200),
    10,
    "option.or fails with option(10).or(option(null)).unwrapOr(200) === 10",
  );
  assertEquals(
    option(null).or(option(null)).unwrapOr(null),
    null,
    "option.or fails with option(null).or(option(null)) === 200",
  );
  assertEquals(
    option(10).orThen((value) => value * 20).unwrap(),
    10,
    "option.orThen option(10).orThen(value => value * 20).unwrap() === 10",
  );
  assertEquals(
    option(null).orThen(() => 10).unwrapOr(200),
    10,
    "option.orThen option(null).orThen(() => 10).unwrapOr(200) === 10",
  );
  assertEquals(
    option(null).orThen(() => null).unwrapOr(null),
    null,
    "option.orThen option(null).orThen(() => null).unwrap() === null",
  );
  //#endregion
});

Deno.test("option.IFilterable", () => {
  assert(option(10).filter((a) => a < 5).isNone(), "10 is less than 5");
  assert(option(10).filter((a) => a > 5).isSome(), "10 is more than 5");
  assert(
    option(10).filterOr(option(0), (a) => a < 5).isSome(),
    "10 is less than 5, but 0 is some",
  );
  assert(
    option<number | null>(10).filterOr(
      option<number | null>(null),
      (a) => typeof a === "string",
    ).isNone(),
    "10 is not a string and null is none",
  );
});

Deno.test("option.IUnwrappable", () => {
  assert(!option(10).isNone(), "option.isNone fails");
  assert(option(10).isSome(), "option.isNone fails");
  assertThrows(() => option(null).unwrap());
  assertThrows(() => none().unwrap());
  assertEquals(option(10).unwrap(), 10, "option.unwrap fails");
  assertEquals(
    option<number | null>(null).unwrapOr(10),
    10,
    "option.unwrapOr fails",
  );
  assertEquals(
    option<number | null>(null).unwrapOrElse(() => 10),
    10,
    "option.unwrapOrElse fails",
  );
});
