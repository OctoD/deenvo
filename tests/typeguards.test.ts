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
