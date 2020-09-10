import {
  assert,
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { fifn } from "../conditionals.ts";
import {
  bind,
  combine,
  createStructOf,
  fi,
  isarrayof,
  isnumber,
  isstring,
  option,
  anyof,
  predicate,
  result,
} from "../mod.ts";
import { Option } from "../option.ts";
import {
  taggedFactory,
  Tagged,
} from "../tagged-type.ts";

Deno.test("example 001 : getting first and last user in mixed array", () => {
  // given this example, you have to
  // filter an array of mixed types
  // and retrieve only objects of a given
  // type
  const emailregexp =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  const isemail = combine(
    isstring,
    (arg): arg is string => typeof arg === "string" && emailregexp.test(arg),
  );
  const isover21 = combine(
    isnumber,
    (arg): arg is number => typeof arg === "number" && arg >= 0 && arg >= 21,
  );
  const expectedtype = createStructOf({
    age: isover21,
    email: isemail,
    name: isstring,
  });
  const tg = isarrayof(expectedtype);

  const expecteditems = [
    { age: 21, name: "yup", email: "foo@bar.baz" },
    { age: 44, name: "one more", email: "foo@bar.baz" },
  ];
  const items = [
    12,
    "not selected",
    { thiswillnot: "be selected" },
    { age: 18, name: "hello", email: "foo@bar.baz" },
    { age: 20, name: "nope", email: "foo@bar.baz" },
    ...expecteditems,
  ];

  assert(!tg(items));
  assert(tg(expecteditems));

  const first = option.option(items.find(expectedtype));
  const last = option.option(items.reverse().find(expectedtype));

  const optionand = predicate.fromvalues(first, last);

  const testresult = fi(
    optionand(option.isSome),
    result.ok(bind(option.unwrap, first)),
    result.err("No item found"),
  );

  assert(result.isOk(testresult));
});

Deno.test("example 002 : validating a matrix", () => {
  const iszero = (arg: unknown): arg is 0 => arg === 0;
  const isone = (arg: unknown): arg is 1 => arg === 1;
  const isbit = anyof<0 | 1>(iszero, isone);
  const ismatrix = isarrayof(isarrayof(isbit));
  const matrix = [
    [0, 1, 0],
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ];

  assert(ismatrix(matrix));
  assert(!ismatrix([1, 2, 3]));
  assert(!ismatrix([[1], [2], [3]]));
});

Deno.test("example 003 : creating a doubly linked list", () => {
  type MaybeListItem<T> = Option<ListItem<T>>;

  interface ListItem<T> {
    value: T;
    next: MaybeListItem<T>;
    prev: MaybeListItem<T>;
  }

  interface List<T> {
    first: MaybeListItem<T>;
    last: MaybeListItem<T>;
  }

  const item = <T>(
    value: T,
    next: MaybeListItem<T> = option.none(),
    prev: MaybeListItem<T> = option.none(),
  ): ListItem<T> => ({
    prev,
    next,
    value,
  });

  const list = <T>(first: MaybeListItem<T> = option.none()): List<T> => ({
    first,
    last: option.mapOr(option.none(), (arg: ListItem<T>) => arg.next)(first),
  });

  const createAdd = <T extends List<K>, K>(list: T) =>
    (arg: ListItem<K>) =>
      fifn(
        option.isSome(list.first),
        () => {
          list.last.value.next = option.some(arg);
          arg.prev = option.some(list.last.value);
          list.last = option.some(arg);
        },
        () => {
          list.first = option.some(arg);
          list.last = option.some(arg);
          arg.prev = list.first;
        },
      );

  const mylist = list<string>();
  const add = createAdd(mylist);

  assert(option.isNone(mylist.first));
  assert(option.isNone(mylist.last));

  const foo = item("foo");
  const bar = item("bar");
  const baz = item("baz");

  add(foo);
  add(bar);
  add(baz);

  assert(option.isOption(mylist.first));
  assertEquals(mylist.first.value, foo);
  assertEquals(mylist.first.value.next.value, bar);
  assertEquals(mylist.last.value.prev.value, bar);
  assertEquals(mylist.last.value, baz);
});

Deno.test("example 004 : creates a state manager", () => {
  const statetag = "state";
  type statetag = typeof statetag;
  const statemanager = taggedFactory(statetag);
  const createmutate = <T extends Tagged<any, statetag>>(state: T) =>
    (key: keyof T["value"], value: T["value"][typeof key]) =>
      Object.assign(state.value, { [key]: value });
  const createreset = <T extends Tagged<any, statetag>>(state: T) => {
    const initial = statemanager({ ...state.value });
    return () => Object.assign(state.value, initial.value);
  };

  const mystate = statemanager({ hello: "world", foo: 123, bar: "baz" });
  const mutate = createmutate(mystate);
  const reset = createreset(mystate);

  assert(mystate.value);
  assert(isstring(mystate.value.bar));
  assert(isnumber(mystate.value.foo));
  assert(isstring(mystate.value.hello));

  assertEquals(mystate.value.bar, "baz");
  assertEquals(mystate.value.hello, "world");
  assertEquals(mystate.value.foo, 123);

  mutate("bar", "isbar");
  mutate("foo", 900);
  mutate("hello", "nobody");

  assertEquals(mystate.value.bar, "isbar");
  assertEquals(mystate.value.hello, "nobody");
  assertEquals(mystate.value.foo, 900);

  reset();

  assertEquals(mystate.value.bar, "baz");
  assertEquals(mystate.value.hello, "world");
  assertEquals(mystate.value.foo, 123);
});
