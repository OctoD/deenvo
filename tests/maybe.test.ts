import {
  assert,
} from "https://deno.land/std/testing/asserts.ts";
import { frompredicate, isJust, isNothing } from "../maybe.ts";

const greaterthan = (value: number) => (arg: number) => arg > value;

Deno.test("maybe::fromPredicate", () => {
  const test = frompredicate(greaterthan(5));

  assert(isNothing(test(4)));
  assert(isJust(test(6)));
});
