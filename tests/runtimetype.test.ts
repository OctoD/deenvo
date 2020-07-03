import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { runtimetype } from "../runtimetype.ts";
import {
  boolean,
  char,
  defined,
  float,
  int,
  plainobject,
  string,

  uint,
} from "../runtimetypes.wellknown.ts";

Deno.test("runtimetype.IAssertable", () => {
  assertThrows(() => float("" as any).expect());
  assertThrows(() => float(10).unexpect());

  assert(float(10).isvalid(), "is not valid");
  assert(int(10.12).isnotvalid(), "is not valid");
});

Deno.test("runtimetype.IConditional", () => {
  assertEquals(
    char("a").and(int(0)),
    int(0),
    "runtimetype.IConditional.and[0]",
  );
  assertEquals(
    char("").and(int(0)),
    char(""),
    "runtimetype.IConditional.and[1]",
  );

  assertEquals(
    char("a").or(int(10)),
    char("a"),
    "runtimetype.IConditional.andThen[0]",
  );
  assertEquals(
    char("").or(int(10)),
    int(10),
    "runtimetype.IConditional.andThen[1]",
  );
});

Deno.test("runtimetype.IUnwrappable", () => {
  assertEquals(defined(10).unwrap(), 10, "runtimetype.IUnwrappable.unwrap");
  assertThrows(() => defined(undefined).unwrap());

  assertEquals(
    defined(10).unwrapOr(20),
    10,
    "runtimetype.IUnwrappable.unwrapOr[0]",
  );
  assertEquals(
    defined(undefined).unwrapOr(20),
    20,
    "runtimetype.IUnwrappable.unwrapOr[1]",
  );

  assertEquals(
    defined(10).unwrapOrElse(() => 20),
    10,
    "runtimetype.IUnwrappable.unwrapOrElse[0]",
  );
  assertEquals(
    defined(undefined).unwrapOrElse(() => 20),
    20,
    "runtimetype.IUnwrappable.unwrapOrElse[1]",
  );
});

Deno.test("derived types", () => {
  const t1 = runtimetype<number>("test1", (arg) => typeof arg === "number");
  const dt1 = t1.derive(
    "positive",
    (arg) => typeof arg === "number" && arg > 1,
  );
  const between = dt1.derive(
    "between2and5",
    (arg) => typeof arg === "number" && arg < 5,
  );

  assert(t1(0).isvalid());
  assertEquals(dt1(0).typeof(), "positivetest1");
  assert(dt1(0).isnotvalid());
  assert(dt1(2).isvalid());
  assert(between(4).isvalid());
  assert(between(1).isnotvalid());
  assert(between(5).isnotvalid());
});

Deno.test("complex types", () => {
  interface IWorld {
    world: number;
  }

  interface IComplex1 {
    bar: number;
    baz: string;
    hello: IWorld;
  }

  const world = plainobject.derive<IWorld>(
    "IWorld",
    (value) => int(value.world).isvalid(),
  );
  const complex1 = plainobject.derive<IComplex1>(
    "IComplex1",
    (value) =>
      float(value.bar).isvalid() &&
      string(value.baz).isvalid() &&
      world(value.hello).isvalid(),
  );

  assert(complex1({ bar: 10, baz: "qwerty", hello: { world: 10 } }).isvalid());
});

Deno.test("runtimetype casting", () => {
  assert(
    int(10).cast(float).isOk(),
  );
  assert(
    int(10).cast(string).isErr(),
  );
  assert(
    int(10).cast(boolean).isErr(),
  );
  assert(
    int(10).cast(uint).isOk(),
  );
  assert(
    int(-10).cast(uint).isErr(),
  );
});
