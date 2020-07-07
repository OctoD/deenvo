import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { linkedlist, node } from "../linked-list.ts";

Deno.test("linkedlist.IEnumerableQueryable", () => {
  const l1 = linkedlist();

  l1.insert(node(10));
  l1.insert(node(20));
  l1.insert(node(30));

  assert(l1.get(6).isErr(), "index 6 should not exists");
  assert(l1.get(-1).isErr(), "index -1 should not exists");
  assert(
    l1.contains(0),
    "linkedlist.IEnumerableQueryable does not contains index 0",
  );
  assert(
    l1.contains(1),
    "linkedlist.IEnumerableQueryable does not contains index 1",
  );
  assert(
    l1.contains(2),
    "linkedlist.IEnumerableQueryable does not contains index 2",
  );
  assertEquals(
    l1.get(0).unwrap().value,
    10,
    "linkedlist.IEnumerableQueryable[0] value is not valid",
  );
  assertEquals(
    l1.get(1).unwrap().value,
    20,
    "linkedlist.IEnumerableQueryable[1] value is not valid",
  );
  assertEquals(
    l1.get(2).unwrap().value,
    30,
    "linkedlist.IEnumerableQueryable[2] value is not valid",
  );
});

Deno.test("linkedlist.IInsertable", () => {
  const l2 = linkedlist();
  let n1;
  let n2;
  let n3;

  l2.insert(n1 = node(1));
  l2.insert(n2 = node(2));
  l2.insert(n3 = node(3));

  assert(l2.contains(0), "linkedlist.IInsertable does not contains index 0");
  assert(l2.contains(1), "linkedlist.IInsertable does not contains index 1");
  assert(l2.contains(2), "linkedlist.IInsertable does not contains index 2");

  l2.remove();

  assert(!l2.contains(2), "linkedlist.IInsertable contains index 2");

  l2.remove();

  assert(!l2.contains(1), "linkedlist.IInsertable contains index 1");

  assertEquals(
    l2.get(0).unwrap().value,
    n3.value,
    "linkedlist.IInsertable did not removed correclty items",
  );
});

Deno.test("linkedlist.IImmediateMappable", () => {
  assertEquals(
    linkedlist().insert(node(10)).map(String).get(0).unwrap().value,
    "10",
    "linkedlist.IImmediateMappable[0] did not map",
  );
  assertThrows(
    () => linkedlist().map(String).get(0).unwrap(),
    undefined,
    undefined,
    "linkedlist.IImmediateMappable[1] did not map",
  );
});

Deno.test("linkedlist", () => {
  assert(
    linkedlist().isempty(),
    "linkedlist is not empty after initialization",
  );
  assert(
    linkedlist().insert(node(10)).isfilled(),
    "linkedlist is not filled after insert",
  );
  assert(
    linkedlist().insert(node(10)).remove().isempty(),
    "linkedlist is not filled after insert and after remove",
  );
});
