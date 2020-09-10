import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { isNone, isOptionOf, isSome, none, some } from "../option.ts";
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
