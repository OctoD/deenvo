import {
  assert,
} from "https://deno.land/std/testing/asserts.ts";
import * as p from "../predicate.ts";

const p1 = p.withsamevalue(10);
const p2 = (arg: unknown) => typeof arg === "number";
const p3 = (arg: number) => arg < 10;
const p4 = (arg: number) => arg > 5;

Deno.test("predicate::" + p.withsamevalue.name, () => {
  assert(p1(10));
  assert(!p1(11));
  assert(!p1("10" as any));
});

Deno.test("predicate::" + p.and.name, () => {
  assert(p.and(p1, p2)(10));
  assert(!p.and(p1, p2, p3)(10));
  assert(p.and(p2, p3, p4)(6));
});

Deno.test("predicate::" + p.fromvalue.name, () => {
  const fv = p.fromvalue(10);
  assert(fv(p1));
  assert(fv(p2));
  assert(!fv(p3));
});

Deno.test("predicate::" + p.or.name, () => {
  assert(p.or(p1, p2)(10));
  assert(p.or(p1, p2, p3, p4)(10));
  assert(!p.or(p1, p3)(12));
});

Deno.test("predicate::" + p.reverse.name, () => {
  assert(p.reverse(p1)(12));
  assert(p.reverse(p3)(12));
  assert(p.reverse(p2)(""));
});

Deno.test("predicate::" + p.noneof.name, () => {
  assert(p.noneof(p1, p2, p3)("qwerty" as any));
  assert(!p.noneof(p1, p2, p4)(10));
});
