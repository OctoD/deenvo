import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

import { bind } from "../applicative.ts";
import { fi, fifn } from "../conditionals.ts";
import { reverse } from '../predicate.ts';

Deno.test("Conditionals::" + fi.name, () => {
  assertEquals(fi(true, 0, 1), 0);
  assertEquals(fi(false, 0, 1), 1);
});

Deno.test("Conditionals::" + fifn.name, () => {
  const fn1 = (arg: number) => arg * 2;
  const fn2 = (arg: number) => arg / 2;
  const iseven = (arg: number) => arg % 2 === 0;
  const isodd = reverse(iseven);
  const testeven = (arg: number) => fifn(iseven(arg), bind(fn2, arg), bind(fn1, arg));
  const testodd = (arg: number) => fifn(isodd(arg), bind(fn1, arg), bind(fn2, arg));
  
  assertEquals(fifn(true, () => 0, () => 1), 0);
  assertEquals(fifn(false, () => 0, () => 1), 1);
  assertEquals(testeven(10), 5);
  assertEquals(testeven(11), 22);
  assertEquals(testodd(10), 5);
  assertEquals(testodd(11), 22);
});
