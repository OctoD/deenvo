import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { createExpect } from "../assertables.ts";
import {
  createTaggedWithValueFactory,
  isTagged,
} from "../tagged-type.ts";

const testtype = createTaggedWithValueFactory("assertabletest");
const expect = createExpect((arg) =>
  isTagged(arg) && typeof arg.value === "string"
);

Deno.test("assertable::expect", () => {
  assertEquals(expect.length, 1);
  assertEquals(expect("").length, 1);
  assertThrows(() => expect("")(testtype(10)));
  assertEquals(
    expect("")(testtype("this will not throw, trust me I am an engineer")),
    testtype("this will not throw, trust me I am an engineer"),
  );
});
