import {
  assert,
} from "https://deno.land/std/testing/asserts.ts";
import type { ArgsOf, FnBase } from "../applicative.ts";
import { isErr, isOk } from "../result.ts";
import { trycatch, trycatchAsync } from "../trycatch.ts";

const alwayspass = () => 10;
const alwaysfails = () => {
  throw "i like pizza";
};
const maybefails = (arg: any) => "foo" in arg;

const promisify = <T extends FnBase>(arg: T) =>
  async (...args: ArgsOf<T>) => arg.apply(null, args);

const alwayspassasync = promisify(alwayspass);
const alwaysfailsasync = promisify(alwaysfails);
const maybefailsasync = promisify(maybefails);

Deno.test(trycatch.name, () => {
  const result1 = trycatch(alwayspass);
  const result2 = trycatch(maybefails, null);
  const result3 = trycatch(alwaysfails);
  const result4 = trycatch(maybefails, {});

  assert(isOk(result1));
  assert(isErr(result2));
  assert(isErr(result3));
  assert(isOk(result4));
});

Deno.test(trycatchAsync.name, async () => {
  const result1 = await trycatchAsync(alwayspassasync);
  const result2 = await trycatchAsync(maybefailsasync, null);
  const result3 = await trycatchAsync(alwaysfailsasync);
  const result4 = await trycatchAsync(maybefailsasync, {});

  assert(isOk(result1));
  assert(isErr(result2));
  assert(isErr(result3));
  assert(isOk(result4));
});
