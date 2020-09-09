import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

import { check, panic } from "../applicative.ts";

Deno.test("applicative::" + check.name, () => {
  assertThrows(() => check(false, "errormessage")(123));
  assertEquals(check(true, "does not throw")(123), 123);
});

Deno.test("applicative::" + panic.name, () => {
  assertThrows(() => panic("message"), Error, "message");
});
