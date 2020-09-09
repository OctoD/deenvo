import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import {
  createTaggedWithValueFactory,
  isTagged,
} from "../tagged-type.ts";
import {
  createUnwrap,
  createUnwrapOr,
  createUnwrapOrElse,
} from "../unwrappables.ts";

const testtype = createTaggedWithValueFactory("unwrappablestest");
const typechecker = (arg: unknown) =>
  isTagged(arg) && typeof arg.value === "number";
const unwrap = createUnwrap(typechecker, "argument is wrong");
const unwrapOr = createUnwrapOr(typechecker);
const unwrapOrElse = createUnwrapOrElse(typechecker);

Deno.test("unwrappables::unwrap", () => {
  assertThrows(() => unwrap(testtype("hello world kaboom")));
  assertEquals(
    unwrap(testtype(10)),
    10,
    "unwrappables::unwrap did not unwrap correctly",
  );
});

Deno.test("unwrappables::unwrapOr", () => {
  assertEquals(
    unwrapOr(10)(testtype("ok")),
    10,
    "unwrappables::unwrapOr did not unwrap correctly",
  );
  assertEquals(
    unwrapOr(10)(testtype(0)),
    0,
    "unwrappables::unwrapOr did not unwrap correctly",
  );
});

Deno.test("unwrappables::unwrapOrElse", () => {
  assertEquals(
    unwrapOrElse(() => 10)(testtype("ok")),
    10,
    "unwrappables::unwrapOrElse did not unwrap correctly",
  );
  assertEquals(
    unwrapOrElse(() => 10)(testtype(0)),
    0,
    "unwrappables::unwrapOrElse did not unwrap correctly",
  );
});
