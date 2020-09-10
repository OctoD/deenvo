import { assertEquals } from "https://deno.land/std@0.66.0/testing/asserts.ts";
import { createDelete, createInsert } from "../insertables.ts";
import { withdifferentvalue } from "../predicate.ts";

Deno.test("insertables::createInsert", () => {
  const arrayinsert = createInsert((subject: number[]) =>
    (arg: number) => [...subject, arg]
  );
  const foo: number[] = [];
  const testinsert = arrayinsert(foo);

  assertEquals(testinsert(1), [1]);
  assertEquals(testinsert(1), [1]);
});

Deno.test("insertables::createDelete", () => {
  const arraydelete = createDelete((subject: number[]) =>
    (arg: number) => subject.filter(withdifferentvalue(arg))
  );
  const foo: number[] = [10, 20, 30];
  const testinsert = arraydelete(foo);

  assertEquals(testinsert(1), foo);
  assertEquals(testinsert(10), [20, 30]);
  assertEquals(foo.length, 3);
});
