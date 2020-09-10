import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import {
  filterLeft,
  filterRight,
  fold,
  frompredicate,
  isEither,
  isEitherOf,
  isLeft,
  isLeftOf,
  isRight,
  isRightOf,
  left,
  mapLeft,
  mapLeftOrElse,
  mapRight,
  mapRigthOrElse,
  right,
  swap,
  unwrapEither,
  unwrapLeft,
  unwrapLeftOr,
  unwrapLeftOrElse,
  unwrapRight,
  unwrapRightOr,
  unwrapRightOrElse,
} from "../either.ts";
import { isnumber, isstring } from "../typeguards.ts";

const fallback = (arg: number) => (): number => arg;

Deno.test("either::typeguards", () => {
  assert(isEither(left(213)));
  assert(isEither(right(213)));
  assert(isLeft(left(123)));
  assert(!isLeft(right(123)));
  assert(!isRight(left(123)));
  assert(isRight(right(123)));
  assert(!isEither(123));
  assert(!isRight(123));
  assert(!isLeft(123));

  assert(isEitherOf(isstring)(right("hello")));
  assert(isEitherOf(isstring)(left("hello")));
  assert(isLeftOf(isstring)(left("hello")));
  assert(isRightOf(isstring)(right("hello")));
  assert(!isLeftOf(isstring)(right("hello")));
  assert(!isRightOf(isstring)(left("hello")));
  assert(!isLeftOf(isnumber)(right("hello")));
  assert(!isRightOf(isnumber)(left("hello")));
});

Deno.test("either::filterables", () => {
  const l = left(55);
  const r = right(5);
  const lessthan = (value: number) => (arg: number) => arg < value;

  assertEquals(filterLeft(lessthan(10))(l), right(undefined));
  assertEquals(filterLeft(lessthan(10))(r), right(undefined));
  assertEquals(filterLeft(lessthan(60))(l), l);
  assertEquals(filterLeft(lessthan(60))(r), right(undefined));

  assertEquals(filterRight(lessthan(1))(l), left(undefined));
  assertEquals(filterRight(lessthan(1))(r), left(undefined));
  assertEquals(filterRight(lessthan(6))(r), r);
  assertEquals(filterRight(lessthan(6))(l), left(undefined));
});

Deno.test("either::foldables", () => {
  const l = left(20);
  const r = right(10);
  const fn1 = (arg: number) => arg / 2;
  const fn2 = (arg: number) => arg * 2;
  const fnfold = fold(fn1, fn2);

  assertEquals(fnfold(l), 10);
  assertEquals(fnfold(r), 20);
  assertEquals(fnfold(swap(l)), 40);
  assertEquals(fnfold(swap(r)), 5);
});

Deno.test("either::mappables", () => {
  const l = left(100);
  const r = right(20);

  const half = (arg: number) => arg / 2;
  const ml = mapLeft(half);
  const mr = mapRight(half);

  assertEquals(unwrapEither(ml(l)), 50);
  assertEquals(unwrapEither(ml(r)), 20);
  assertEquals(unwrapEither(mr(l)), 100);
  assertEquals(unwrapEither(mr(r)), 10);

  const mlor = mapLeftOrElse(fallback(1000), half);
  const mror = mapRigthOrElse(fallback(2000), half);

  assertEquals(unwrapEither(mlor(l)), 50);
  assertEquals(unwrapEither(mlor(r)), 1000);
  assertEquals(unwrapEither(mror(l)), 2000);
  assertEquals(unwrapEither(mror(r)), 10);
});

Deno.test("either::unwrappables", () => {
  const l = left(10);
  const r = right(20);

  assertEquals(unwrapEither(l), 10);
  assertEquals(unwrapEither(r), 20);

  assertThrows(() => unwrapLeft(r));
  assertThrows(() => unwrapRight(l));

  assertEquals(unwrapLeft(l), 10);
  assertEquals(unwrapRight(r), 20);

  const unwraplor = unwrapLeftOr(10);
  const unwrapror = unwrapRightOr(20);

  assertEquals(unwraplor(l), 10);
  assertEquals(unwraplor(r), 10);
  assertEquals(unwrapror(r), 20);
  assertEquals(unwrapror(l), 20);

  const unwraplorelse = unwrapLeftOrElse(fallback(10));
  const unwraprorelse = unwrapRightOrElse(fallback(20));

  assertEquals(unwraplorelse(l), 10);
  assertEquals(unwraplorelse(r), 10);
  assertEquals(unwraprorelse(l), 20);
  assertEquals(unwraprorelse(r), 20);
});

Deno.test("either::frompredicate", () => {
  const greaterthan5 = (arg: number) => arg > 5;
  const test = frompredicate(greaterthan5);

  assert(isLeft(test(4)));
  assert(isRight(test(8)));
});
