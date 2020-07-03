import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { pushsub } from "../pushsub.ts";

Deno.test("tests push/sub", () => {
  const obj = { qt: 0 };
  const pb = pushsub<(qt: number) => any>();

  assertEquals(obj.qt, 0, "🤦🏻‍♀️");

  pb.notify(5);

  assertEquals(obj.qt, 0, "🤦🏻‍♀️");

  const unsub1 = pb.subscribe((num) => obj.qt += num);

  pb.notify(5);

  assertEquals(obj.qt, 5, "did not increment correctly");

  const unsub2 = pb.subscribe((num) => obj.qt /= num);

  pb.notify(5);

  assertEquals(obj.qt, 2, "did not divide correctly");

  unsub2();

  pb.notify(5);

  assertEquals(obj.qt, 7, "did not unsubscribed correctly");

  unsub1();

  pb.notify(51235467);

  assertEquals(obj.qt, 7, "did not unsubscribed correctly");
});
