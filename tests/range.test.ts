import {
  assertEquals,
  assert,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { isnumber } from '../common.ts';
import { daterange, range, rangefactory } from "../range.ts";

Deno.test('Range (empty)', () => {
  const my = range();

  assert(!my.contains(0), 'empty range cannot contains elements');
  assertEquals(my.length, 0, 'empty range length must be 0');
  assert(!('0' in my), 'empty range propererty [0] must be undefined')
});

Deno.test('Range (filled)', () => {
  const my = range(1, 3);

  assert(my.contains(0), 'range must contains an item at [0]');
  assert(my.contains(1), 'range must contains an item at [1]');
  assert(my.contains(2), 'range must contains an item at [2]');
  assert(!my.contains(3), 'range must not contains an item at [3]');
  assertEquals(my.get(0), 1, 'got invalid item at [0]');
  assertEquals(my.get(1), 2, 'got invalid item at [1]');
  assertEquals(my.get(2), 3, 'got invalid item at [2]');
  assertEquals(my.length, 3, 'got invalid length');

  my.remove(4);

  assertEquals(my.length, 3, 'removing a non existent item should not affect length');

  my.remove(1);

  assertEquals(my.length, 2, 'removing an existent item should affect length');

  assertEquals(my.get(0), 2, 'got invalid item at [0] after deletion');
  assertEquals(my.get(1), 3, 'got invalid item at [1] after deletion');
  assert(!my.contains(2), 'should not include last index after deletion');
  assertEquals(my.length, 2, 'length should not be the same after a deletion');

  my.insert(4).insert(5);

  assertEquals(my.length, 4, 'length should not be the same after two insertions');

  my.remove(2).remove(3);

  assertEquals(my.get(0), 4, 'got invalid item at [0] after two deletions');
  assertEquals(my.get(1), 5, 'got invalid item at [1] after two deletions');
  assertEquals(my.length, 2, 'length should not be the same after two deletions');
});

Deno.test('Daterange', () => {
  assertEquals(daterange(new Date(2020, 0, 1), new Date(2020, 1, 1)).length, 32);
});

Deno.test('range (numeric)', () => {
  assertEquals(range(0, 10).length, 11)
  assertEquals(range(0, 9).toArray(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
})

Deno.test('readme example', () => {
  const doublednumbersrange = rangefactory<number>((start, end) => {
    const range: number[] = [];
    
    if (isnumber(start) && isnumber(end)) {
      while (range.length <= Math.abs(start - end)) {
        range.push((start + range.length) * 2);
      }
    }
  
    return range;
  });

  assertEquals(doublednumbersrange(1, 3).toArray(), [2, 4, 6])
})