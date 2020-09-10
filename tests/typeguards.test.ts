import {
  assert,
} from "https://deno.land/std/testing/asserts.ts";

import * as tg from "../typeguards.ts";

Deno.test("typeguards", () => {
  assert(tg.isarray([]));
  assert(!tg.isarray(123));

  assert(!tg.isbigint(0));
  assert(tg.isbigint(0n));
  assert(tg.isboolean(true));
  assert(!tg.isboolean(0));
  assert(tg.iserror(new Error()));
  assert(!tg.iserror(new Object()));
  assert(tg.isfunction(assert));
  assert(!tg.isfunction(23));
  assert(tg.isindexable({}));
  assert(tg.isindexable([]));
  assert(!tg.isindexable(""));
  assert(tg.isnull(null));
  assert(!tg.isnull(undefined));
  assert(tg.isnumber(0));
  assert(!tg.isnumber(new Date()));
  assert(tg.isobject({}));
  assert(tg.isobject([]));
  assert(!tg.isobject(""));
  assert(tg.isstring(""));
  assert(tg.isstring(String()));
  assert(!tg.isstring(Number()));
  assert(tg.isundefined(undefined));
  assert(!tg.isundefined(null));

  assert(tg.haskeyWithValue("foo", 123)({ foo: 123 }));
});

Deno.test("typeguards factories", () => {
  const tuple1 = tg.createTupleOf(tg.isstring, tg.isstring, tg.isnumber);
  const struct1 = tg.createStructOf({
    foo: tg.isarray,
    bar: tg.isstring,
    baz: tg.isboolean,
    hello: {
      world: tg.isobject,
    },
  });

  assert(tuple1(["", "", 0]));
  assert(!tuple1([0, "", ""]));
  assert(struct1({
    foo: [],
    bar: "",
    baz: false,
    hello: {
      world: {},
    },
  }));
  assert(
    !struct1({
      foo: [],
      bar: "",
      baz: false,
    }),
  );
  assert(!struct1({}));
});

Deno.test("typeguards::" + tg.combine, () => {
  type foo = { bar: string; baz: number };
  const isfoo = tg.combine<foo>(
    tg.haskeyoftype("bar", tg.isstring),
    tg.haskeyoftype("baz", tg.isnumber),
  );

  assert(isfoo({ bar: "0", baz: 0 }));
  assert(!isfoo({ bar: 0, baz: "0" }));
});

Deno.test("typeguards::" + tg.nullable.name, () => {
  const isnullablenumber = tg.nullable(tg.isnumber);

  assert(isnullablenumber(null));
  assert(isnullablenumber(1000));
  assert(!isnullablenumber("10"));
});

Deno.test("typeguards::" + tg.optional.name, () => {
  const isoptionalnumber = tg.optional(tg.isnumber);

  assert(!isoptionalnumber(null));
  assert(isoptionalnumber(undefined));
  assert(isoptionalnumber(1000));
  assert(!isoptionalnumber("10"));
});

Deno.test("typeguards::isarrayof", () => {
  const isarrayofStrings = tg.isarrayof(tg.isstring);
  const isarrayofNumbers = tg.isarrayof(tg.isnumber);

  assert(!isarrayofStrings([10, 20, "hello", "world"]));
  assert(!isarrayofNumbers([10, 20, "hello", "world"]));
  assert(!isarrayofStrings([10, 20]));
  assert(isarrayofNumbers([10, 20]));
  assert(isarrayofStrings(["hello", "world"]));
  assert(!isarrayofNumbers(["hello", "world"]));

  // let's do something better
  class Foo {
    constructor(
      public name: string,
      public age: number,
      public favouritepet?: string,
    ) {}
  }
  const foo = (name: string, age: number, favouritepet?: string) =>
    new Foo(name, age, favouritepet);
  const isFoo = tg.createStructOf<Foo>({
    age: tg.isnumber,
    name: tg.isstring,
    favouritepet: tg.optional(tg.isstring),
  });
  const isarrayOfFoo = tg.isarrayof(isFoo);
  const isarrayofNullablesFoo = tg.isarrayof(tg.nullable(isFoo));

  assert(isFoo(new Foo("", 100)));
  assert(isFoo(new Foo("", 100, "hello")));
  assert(!isFoo(new Foo("", 100, 123 as any)));
  assert(isarrayOfFoo([]));
  assert(isarrayofNullablesFoo([]));
  assert(!isarrayOfFoo(foo("", 100)));
  assert(
    isarrayOfFoo([foo("foo", 22), foo("bar", 33), foo("baz", 44, "pippo")]),
  );
  assert(isarrayOfFoo([foo("foo", 22), foo("bar", 33), foo("baz", 44)]));
  assert(
    !isarrayOfFoo([foo("foo", 22), foo("bar", 33), foo("baz", 44, 123 as any)]),
  );
  assert(isarrayofNullablesFoo([foo("foo", 22), null, foo("baz", 44)]));
});
