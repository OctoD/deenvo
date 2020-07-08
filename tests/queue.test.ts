import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { queue, queueable } from "../queue.ts";

Deno.test("queue", () => {
  const queueable1 = () => 10;
  const queueable2 = () => 20;
  const queueable3 = () => 30;
  const myqueue = queue(queueable1, queueable2, queueable3);

  assertEquals(myqueue.call().length, 3, "queue length is wrong");
  assertEquals(
    myqueue.call()[0].unwrap(),
    queueable1(),
    "queueable1 return value is wrong",
  );
  assertEquals(
    myqueue.call()[1].unwrap(),
    queueable2(),
    "queueable2 return value is wrong",
  );
  assertEquals(
    myqueue.call()[2].unwrap(),
    queueable3(),
    "queueable3 return value is wrong",
  );
});

Deno.test("queue (call with params)", () => {
  const queueable1 = (arg: number) => arg ** 2;
  const queueable2 = (arg: number) => arg + 2;
  const queueable3 = (arg: number) => arg / 2;
  const myqueue = queue(queueable1, queueable2, queueable3);

  assertEquals(myqueue.call(10).length, 3, "queue length is wrong");
  assertEquals(
    myqueue.call(10)[0].unwrap(),
    100,
    "queueable1 return value is wrong",
  );
  assertEquals(
    myqueue.call(10)[1].unwrap(),
    12,
    "queueable2 return value is wrong",
  );
  assertEquals(
    myqueue.call(10)[2].unwrap(),
    5,
    "queueable3 return value is wrong",
  );
});

Deno.test("queue (call-async with params)", async () => {
  const queueable1 = async (arg: number) => arg ** 2;
  const queueable2 = async (arg: number) => arg + 2;
  const queueable3 = async (arg: number) => arg / 2;
  const myqueue = queue(queueable1, queueable2, queueable3);

  assertEquals(
    (await myqueue.callasync(10)).length,
    3,
    "queue length is wrong",
  );
  assertEquals(
    (await myqueue.callasync(10))[0].unwrap(),
    100,
    "queueable1 return value is wrong",
  );
  assertEquals(
    (await myqueue.callasync(10))[1].unwrap(),
    12,
    "queueable2 return value is wrong",
  );
  assertEquals(
    (await myqueue.callasync(10))[2].unwrap(),
    5,
    "queueable3 return value is wrong",
  );
});
