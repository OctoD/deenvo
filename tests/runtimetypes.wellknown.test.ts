import {
  assert,
  assertThrows,
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { RuntimeType } from "../runtimetype.ts";
import * as types from "../runtimetypes.wellknown.ts";

function createtest<T>(
  type: RuntimeType<T>,
  validvalues: any[],
  invalids: any[] = [],
) {
  Deno.test(`runtimetype.wellknown.${type(validvalues[0]).typeof()}`, () => {
    validvalues.forEach((valid) => {
      assert(type(valid).expect().isvalid(), `Passed value ${valid}`);
      assertEquals(type(valid).unwrap(), valid, `Passed value ${valid}`);
    });
    invalids.forEach((invalid) =>
      assertThrows(
        () => type(invalid).expect(),
        undefined,
        undefined,
        `Passed value ${invalid}`,
      )
    );
  });
}

createtest(types.any, [""]);
createtest(types.bigint, [10n, -12n, 0n], [1000, 200123, Infinity, "qwe"]);
createtest(types.byte, [10], [1000]);
createtest(types.char, ["a"], ["", 1]);
createtest(types.defined, ["a"], [undefined]);
createtest(
  types.float,
  [10, 22, 22.2200],
  ["a", undefined, null, new ArrayBuffer(0)],
);
createtest(
  types.fn,
  [() => void 0, function test() {}, Number, String],
  [{}, "", []],
);
createtest(types.int, [10, 20, 0, -100], [Infinity, 20.20, undefined, null]);
createtest(
  types.string,
  ["hello", "world", new Date().toJSON()],
  [100, null, undefined],
);
createtest(
  types.ubigint,
  [0n, 100n, 22n],
  [Infinity, -1, -123, "qwerty"],
);
createtest(
  types.ufloat,
  [0, 100, 22.213],
  [Infinity, -1, -123, "", 10n],
);
createtest(
  types.uint,
  [0, 100],
  [Infinity, -1, -123, -12.23, 12.23, "", 10n],
);
createtest(types.binaryfn, [
  (a: any, b: any) => void 0,
], [
  () => void 0,
  (a: any) => void 0,
  (a: any, b: any, c: any) => void 0,
]);
createtest(types.nullable, [
  null,
  [],
  {},
], [
  undefined,
  function () {},
]);
createtest(types.object, [
  {},
  [],
], [null]);
createtest(types.ubigint, [
  100n,
  0n,
], [-10n, -1n]);
createtest(types.unaryfn, [
  (a: number) => a,
], [
  (a: any, b: any, c: any) => void 0,
  (a: any, b: any) => void 0,
]);
createtest(types.array, [
  [],
  new Array(),
], [
  {},
  null,
]);
createtest(types.plainobject, [
  {},
  { a: 10, b: 20 },
], [
  null,
  [],
]);
createtest(types.chararray, [
  [],
  ["a", "b"],
], [
  [1],
  ["hello", "world"],
]);
createtest(types.stringarray, [
  [],
  ["a", "b"],
  ["hello", "world"],
], [
  [1],
  [1, 2],
  [new Date()],
]);
createtest(types.floatarray, [
  [],
  [0, .22],
  [-100],
], [
  [new Date()],
  ["new Date()"],
]);
createtest(types.ufloatarray, [
  [],
  [0, .22],
], [
  [-100],
  [new Date()],
  ["new Date()"],
]);
createtest(types.intarray, [
  [],
  [0, 1202301],
  [-100],
], [
  [new Date()],
  ["new Date()"],
]);
createtest(types.uintarray, [
  [],
  [0, 22],
], [
  [-100],
  [new Date()],
  ["new Date()"],
]);

Deno.test("impl type (the complex one)", () => {
  assert(
    types.impl({
      hello: types.string,
      world: types.int,
      foo: {
        bar: types.defined,
        baz: types.any,
      },
    })({
      hello: "",
      world: 100,
      foo: {
        bar: "",
        baz: 12345,
      },
    }).isvalid(),
  );
});
