import {
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { createMap, createMapOr, createMapOrElse } from "../mappables.ts";
import {
  taggedFactory,
  isTagged,
} from "../tagged-type.ts";

const tagged = taggedFactory("testtag");
const map = createMap(isTagged, tagged);
const mapOr = createMapOr(isTagged, tagged);
const mapOrElse = createMapOrElse(isTagged, tagged);
const stringlength = (arg: string) => arg.length;
const hello = tagged("hello");

Deno.test("mappables::" + createMap.name, () => {
  const testmap = map(stringlength);
  assertEquals(testmap(hello), tagged(5));
});

Deno.test("mappables::" + createMapOr.name, () => {
  const testmapOr = mapOr(tagged(10), stringlength);
  assertEquals(testmapOr(hello), tagged(5));
  assertEquals(testmapOr(123 as any), tagged(10));
});

Deno.test("mappables::" + createMapOrElse.name, () => {
  const testmapOrElse = mapOrElse(() => 0, stringlength);
  assertEquals(testmapOrElse(hello), tagged(5));
  assertEquals(testmapOrElse(123 as any), tagged(0));
});
