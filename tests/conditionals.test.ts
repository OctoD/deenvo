import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

import { fi, fifn } from "../conditionals.ts";

Deno.test("Conditionals::" + fi.name, () => {
  assertEquals(fi(true, 0, 1), 0);
  assertEquals(fi(false, 0, 1), 1);
});

Deno.test("Conditionals::" + fifn.name, () => {
  assertEquals(fifn(true, () => 0, () => 1), 0);
  assertEquals(fifn(false, () => 0, () => 1), 1);
});
