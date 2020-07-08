import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { stack, stackable } from '../stack.ts';

Deno.test('stack', () => {
  const stackable1 = () => 10;
  const stackable2 = () => 20;
  const stackable3 = () => 30;
  const mystack = stack(stackable1, stackable2, stackable3);

  assertEquals(mystack.call().length, 3, 'stack length is wrong');
  assertEquals(mystack.call()[2].unwrap(), stackable1(), 'stackable1 return value is wrong')
  assertEquals(mystack.call()[1].unwrap(), stackable2(), 'stackable2 return value is wrong')
  assertEquals(mystack.call()[0].unwrap(), stackable3(), 'stackable3 return value is wrong')
});

Deno.test('stack (call with params)', () => {
  const stackable1 = (arg: number) => arg ** 2;
  const stackable2 = (arg: number) => arg + 2;
  const stackable3 = (arg: number) => arg / 2;
  const mystack = stack(stackable1, stackable2, stackable3);
  
  assertEquals(mystack.call(10).length, 3, 'stack length is wrong');
  assertEquals(mystack.call(10)[2].unwrap(), 100, 'stackable1 return value is wrong')
  assertEquals(mystack.call(10)[1].unwrap(), 12, 'stackable2 return value is wrong')
  assertEquals(mystack.call(10)[0].unwrap(), 5, 'stackable3 return value is wrong')
});

Deno.test('stack (call-async with params)', async () => {
  const stackable1 = async (arg: number) => arg ** 2;
  const stackable2 = async (arg: number) => arg + 2;
  const stackable3 = async (arg: number) => arg / 2;
  const mystack = stack(stackable1, stackable2, stackable3);
  
  assertEquals((await mystack.callasync(10)).length, 3, 'stack length is wrong');
  assertEquals((await mystack.callasync(10))[2].unwrap(), 100, 'stackable1 return value is wrong')
  assertEquals((await mystack.callasync(10))[1].unwrap(), 12, 'stackable2 return value is wrong')
  assertEquals((await mystack.callasync(10))[0].unwrap(), 5, 'stackable3 return value is wrong')
});
