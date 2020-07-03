import {
  assertEquals,
  assert,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { list } from "../list.ts";

Deno.test("list.IAssertable", () => {
  assertThrows(() => list().expect());
  assertThrows(() => list(10).unexpect());
});

Deno.test("list.IConditional", () => {
  assertEquals(
    list(10, 20).and(list(30, 40)),
    list(30, 40),
    "list.IConditional.and[0] failed",
  );
  assertEquals(
    list(10, 20).and(list()),
    list(),
    "list.IConditional.and[1] failed",
  );
  assertEquals(
    list().and(list(10, 20)),
    list(),
    "list.IConditional.and[2] failed",
  );

  assertEquals(
    list(10, 20).or(list(30, 40)),
    list(10, 20),
    "list.IConditional.or[0] failed",
  );
  assertEquals(
    list(10, 20).or(list()),
    list(10, 20),
    "list.IConditional.or[1] failed",
  );
  assertEquals(
    list().or(list(10, 20)),
    list(10, 20),
    "list.IConditional.or[2] failed",
  );
});

Deno.test("list.IFilterable", () => {
  assertEquals(
    list(10).insert(20),
    list(10, 20),
    "list.IFilterable.insert failed",
  );
  assertEquals(
    list(10, 20, 20, 10).remove(20),
    list(10, 10),
    "list.IFilterable.remove failed",
  );
});

Deno.test("list.IFilterable", () => {
  assertEquals(
    list(10, 20).filter((a) => a > 10),
    list(20),
    "list.IFilterable.filter[0] failed",
  );
  assertEquals(
    list(10, 20).filter((a) => a === 10),
    list(10),
    "list.IFilterable.filter[1] failed",
  );
  assertEquals(
    list(10, 20).filterOr(list(500), (arg) => arg < 10),
    list(500),
    "list.IFilterable.filterOr[0] failed",
  );
});

Deno.test("list.IMappable", () => {
  assertEquals(
    list(1, 2).map((a) => a * 2),
    list(2, 4),
    "list.IMappable.map failed",
  );
  assertEquals(
    list<number>().mapOr(list(10), (a) => a * 2),
    list(10),
    "list.IMappable.mapOr failed",
  );
});

Deno.test("list.IUnwrappable", () => {
  assertEquals(list(1, 2).unwrap(), [1, 2], "list.IUnwrappable.unwrap failed");
  assertEquals(
    list().unwrapOr([3, 4]),
    [3, 4],
    "list.IUnwrappable.unwrapOr[0] failed",
  );
  assertEquals(
    list(1, 2).unwrapOr([3, 4]),
    [1, 2],
    "list.IUnwrappable.unwrapOr[1] failed",
  );
  assertEquals(
    list().unwrapOrElse(() => [3, 4]),
    [3, 4],
    "list.IUnwrappable.unwrapOrElse[0] failed",
  );
  assertEquals(
    list(1, 2).unwrapOrElse(() => [3, 4]),
    [1, 2],
    "list.IUnwrappable.unwrapOrElse[1] failed",
  );
});

Deno.test("list", () => {
  assert(list().isEmpty(), "list.isEmpty failed");
  assert(list(1).isFilled(), "list.isFilled failed");
  assertEquals(list(1, 2, 3).len(), 3, "list.len failed");
});
