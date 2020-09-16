import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { isNone, isOptionOf, isSome, none, some, filter, filterOr, unwrap } from "../option.ts";
import { isnumber, isstring } from "../typeguards.ts";

Deno.test("option::typeguards", () => {
  const testsome = some(10);
  const testsomeof = some("hello world");
  const testnone = none();

  assert(isSome(testsome));
  assert(isSome(testsomeof));
  assert(!isOptionOf(isnumber)(testsomeof));
  assert(isOptionOf(isstring)(testsomeof));
  assert(isNone(testnone));
});

const fnfilter = (arg: number) => arg > 0;

Deno.test('option::' + filter.name, () => {
  assert(isSome(filter(fnfilter)(some(10))))
  assert(isNone(filter(fnfilter)(some(-1))))
});

Deno.test('option::' + filterOr.name, () => {
  const fallback = some(0);
  assertEquals(unwrap(filterOr(fallback, fnfilter)(some(10))), 10)
  assertEquals(unwrap(filterOr(fallback, fnfilter)(some(-1))), 0)
});