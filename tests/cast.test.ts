import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

import { cast, createCast, maybe, option, result } from "../mod.ts";

Deno.test("cast::" + cast.name, () => {
  const justtosome = cast(maybe.just("10"), option.some);

  assert(option.isSome(justtosome));
  assertEquals(option.unwrap(justtosome), "10");
});

Deno.test("cast::" + createCast.name, () => {
  const tosome = createCast(option.some);

  assert(option.isSome(tosome(maybe.just(10))));
  assert(option.isSome(tosome(result.err("fooo"))));
});
