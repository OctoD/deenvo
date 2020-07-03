import {
  assertEquals,
  assert,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

import { safe, safeAsync } from "../safe.ts";

Deno.test("safe", () => {
  assert(safe(() => 10).isOk());
  assert(
    safe(() => {
      throw new Error();
    }).isErr(),
  );
});

Deno.test("safeasync", async () => {
  assert((await safeAsync(async () => 10)).isOk());
  assert((await safeAsync(async () => {
    throw new Error();
  })).isErr());
});
