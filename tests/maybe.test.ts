import {
  assertEquals,
  assert,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { maybe, just, nothing } from "../maybe.ts";

Deno.test("just", () => {
  assertThrows(() => just(""));
  assertThrows(() => just(0));
  assertThrows(() => just(false));
  assertThrows(() => just(NaN));
  assertThrows(() => just(null));
  assertThrows(() => just(undefined));
});

Deno.test("nothing", () => {
  assert(nothing().isNothing(), "nothing else matters");
});

Deno.test("maybe.IAssertable", () => {
  assertThrows(() => nothing().expect("explode"));
  assertThrows(() => just(123).unexpect("explode"));
});

Deno.test("maybe.IConditional", () => {
  assert(maybe(10).and(maybe(20)).isJust(), "10 and 20 are just");
  assert(maybe(10).and(maybe(null)).isNothing(), "10 and null are nothing");
  assert(maybe(null).and(maybe(null)).isNothing(), "null and null are nothing");
  assert(maybe(10).or(maybe(20)).isJust(), "10 or 20 are just");
  assert(maybe(10).or(maybe(null)).isJust(), "10 or null are just");
  assert(maybe(null).or(maybe(null)).isNothing(), "null or null are nothing");

  assert(just(10).andThen(() => 20).isJust(), "10 and fn => 20 are truthy");
  assert(
    just(10).andThen(() => null).isNothing(),
    "10 and fn => 20 are nothing",
  );
  assert(just(10).orThen(() => null).isJust(), "10 and nothing are just");
  assert(
    nothing().orThen(() => null).isNothing(),
    "nothing and nothing are nothing",
  );
});

Deno.test("maybe.IMappable", () => {
  assertEquals(just(10).map((a) => a ** 2).unwrap(), 100, "10 ** 2 === 100");
  assertEquals(
    just(10).mapOr(maybe(20), (arg) => arg + 20).unwrap(),
    30,
    "10 + 20 === 30",
  );
  assertEquals(just(1).mapOrElse(() => 0, () => 2).unwrap(), 2, "2");

  assertEquals(
    nothing().map((b: any) => b ** 2).unwrapOr("nope"),
    "nope",
    "nothing maps to nothing",
  );
  assertEquals(
    nothing().mapOr(maybe(10), (b: any) => b ** 2).unwrapOr("nope"),
    10,
    "nothing or maps to or",
  );
  assertEquals(
    nothing().mapOrElse(() => 1000, (b: any) => b ** 2).unwrapOr("nope"),
    1000,
    "nothing or else maps to or else",
  );
});

Deno.test("maybe.IUnwrappable", () => {
  assertThrows(() => nothing().unwrap());
  assertEquals(just(10).unwrap(), 10);
  assertEquals(nothing().unwrapOr("fallback"), "fallback");
});
