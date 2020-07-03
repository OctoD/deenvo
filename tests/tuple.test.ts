import {
  assertEquals,
  assert,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

import { tuple } from "../tuple.ts";

Deno.test("tuple", () => {
  const test = tuple(10, 20, "hello", "world");

  assertEquals(test.size(), 4, "tuple size is wrong");
  assertEquals(test.indexOf("hello"), 2, "indexof did not get value");
  assertEquals(test[0], 10, "arg 0 is invalid");
  assertEquals(test[1], 20, "arg 1 is invalid");
  assertEquals(test[2], "hello", "arg 2 is invalid");
  assertEquals(test[3], "world", "arg 3 is invalid");
  assertEquals(test.keys(), [0, 1, 2, 3], "keys do not match");
});
