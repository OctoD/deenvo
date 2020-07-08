import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import {
  doublylinkedlist,
  doublynode,
  DoublyLinkedList,
} from "../doubly-linked-list.ts";

Deno.test("doublylinkedlist", () => {
  const list = doublylinkedlist<number>();
  const n1 = doublynode(1);
  const n2 = doublynode(2);
  const n3 = doublynode(3);

  list.insert(n1);
  list.insert(n2);
  list.insert(n3);

  assert(list.isfilled(), "doublylinkedlist is not filled");

  assertEquals(
    list.get(0).unwrap(),
    n1,
    "doublylinkedlist item.prev at 1 index is undefined",
  );
  assertEquals(
    list.get(1).unwrap(),
    n2,
    "doublylinkedlist item.prev at 1 index is undefined",
  );
  assert(
    list.get(1).unwrap().prev !== undefined,
    "doublylinkedlist item.prev at 1 index is undefined",
  );
  assert(
    list.get(1).unwrap().prev === n1,
    "doublylinkedlist item.prev at 1 index is undefined",
  );
  assert(
    list.get(1).unwrap().next === n3,
    "doublylinkedlist item.prev at 1 index is undefined",
  );

  const r: number[] = [];
  const rReversed: number[] = [];
  const expectedr = [n1.value, n2.value, n3.value];
  const expectedrReversed = expectedr.slice().reverse();

  list.forEach((a) => r.push(a.value));
  list.forEach((a) => rReversed.push(a.value), true);

  assertEquals(r, expectedr, "doublylinkedlist forEach did not do the work");
  assertEquals(
    rReversed,
    expectedrReversed,
    "doublylinkedlist forEach(reversed) did not do the work",
  );

  const mapped = list.map(String) as DoublyLinkedList<string>;
  const mappedexpected = expectedr.map(String);

  const a: string[] = [];

  mapped.forEach((x) => a.push(x.value));

  assertEquals(
    a,
    mappedexpected,
    "doublylinkedlist forEach(mapped) did not do the work",
  );
});
