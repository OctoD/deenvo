import {
  assert,
  assertEquals,

  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { err, ok, result } from "../result.ts";

Deno.test("result.IAssertable", () => {
  assertThrows(() => ok(new Error("")));
  assertThrows(() => ok(10).unexpect("to be an error? boom"));
});

Deno.test("result.IConditional", () => {
  assert(result(10).and(result(20)).isOk(), "both 10 and 20 are not errs");
  assert(result(10).and(err("")).isErr(), "10 is ok but err is err");
  assert(err("").and(err("")).isErr(), "errs are errs");

  assert(
    result(10).andThen((a) => a + 10).isOk(),
    "10 and (10 + 2) are both ok",
  );
  assert(
    result(10).andThen((a) => new Error()).isErr(),
    "10 is ok but fn returns an error",
  );
  assert(err("").andThen((b) => 10).isErr(), "10 is not and error but err is");

  assert(result(10).or(result(20)).isOk(), "both 10 and 20 are not errs");
  assert(err("").or(result(5)).isOk(), "err is err, but 5 is ok");
  assert(result(10).or(err("")).isOk(), "10 is ok and err is err but it is ok");
  assert(result(5).orThen(() => new Error()).isOk(), "5 is ok");
  assert(err("").orThen(() => 5).isOk(), "5 is ok");
});

Deno.test("result.IMappable", () => {
  assertEquals(ok(10).map((a) => a * 2), ok(20), "10 and 20 are same");
  assertEquals(err("").mapOr(ok(10), () => <any> "nope"), ok(10), "");
  assertEquals(ok(10).mapOrElse(() => 0, () => 1), ok(1));
  assertEquals(err("10").mapOrElse(() => 0, () => 1), ok(0));
});

Deno.test("result.IUnwrappable", () => {
  assertEquals(ok(10).unwrap(""), 10);
  assertEquals(err("").unwrapOr(10), 10);
  assertEquals(err("").unwrapOrElse(() => 10), 10);
  assertEquals(ok("hello").unwrapOrElse(() => "world"), "hello");
});
