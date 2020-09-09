import {
  assert,
  assertEquals,
  assertThrows,
  assertNotEquals,
} from "https://deno.land/std/testing/asserts.ts";

import { pipe } from "../pipe.ts";
import * as option from "../option.ts";

const fnstart = (arg: string) => arg.length;
const fnmid = (arg: number) => arg * 2;
const fnend = (arg: number) => `length: ${arg}`;

Deno.test("pipe::pipe", () => {
  assertEquals(
    pipe(fnstart, fnmid, fnend)("hello"),
    "length: 10",
    "pipe did not invoked functions properly",
  );
});

Deno.test("pipe::pipe::option", () => {
  const mapstart = option.mapOr(option.some(0), fnstart);
  const mapmiddle = option.map(fnmid);
  const mapend = option.map(fnend);

  assertEquals(
    pipe(mapstart, mapmiddle, mapend, option.unwrap)(option.option("hello")),
    "length: 10",
    "pipe with option did not invoked functions properly",
  );
});
