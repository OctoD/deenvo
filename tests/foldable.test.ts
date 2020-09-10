import {
  assert,
  assertEquals,
  assertThrows,
  assertNotEquals,
} from "https://deno.land/std/testing/asserts.ts";
import * as foldables from "../foldables.ts";
import * as taggedtype from "../tagged-type.ts";

Deno.test("foldables::" + foldables.createfold.name, () => {
  const fn = foldables.createfold((arg) =>
    taggedtype.isTagged(arg) && arg.__tag === "fail"
  );
  const test1 = fn((arg: number) => arg + 10, (input: string) => input.length);
  const successfactory = taggedtype.taggedFactory("test");
  const failfactory = taggedtype.taggedFactory("fail");

  assertEquals(test1(failfactory(100)), 110, "");
  assertNotEquals(test1(failfactory("100")), 110, "");
  assertEquals(test1(successfactory("helloworld")), "helloworld".length, "");
  assertNotEquals(test1(successfactory(100)), "helloworld".length, "");
});
