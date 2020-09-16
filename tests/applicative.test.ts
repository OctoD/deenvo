import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

import { check, panic, toasync } from "../applicative.ts";

Deno.test("applicative::" + check.name, () => {
  assertThrows(() => check(false, "errormessage")(123));
  assertEquals(check(true, "does not throw")(123), 123);
});

Deno.test("applicative::" + panic.name, () => {
  assertThrows(() => panic("message"), Error, "message");
});

Deno.test("applicative::" + toasync.name, async () => {
  const fntest = (arg: number) => arg + 1;
  const fntestasync = toasync(fntest);
  const arg = 10;

  assertEquals(await fntestasync(arg), fntest(arg));
});
