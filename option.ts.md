[back](README.md)

# option

- [option](#option)
  - [Creating an option type](#creating-an-option-type)
  - [Methods](#methods)
      - [isNone](#isnone)
      - [isSome](#issome)
      - [maybe](#maybe)
      - [result](#result)
  - [shorthands for some and none](#shorthands-for-some-and-none)

## Creating an option type

```ts
import { option } from 'https://deno.land/x/deenvo';

option('hello world')
```

## Methods

Maybe implements methods from

- [IAssertable](IAssertable.ts.md)
- [IConditional](IConditional.ts.md)
- [IFilterable](IFilterable.ts.md)
- [IMappable](IMappable.ts.md)
- [IUnwrappable](IUnwrappable.ts.md)

It also has it's own methods:

#### isNone

Returns true if `T` is none

#### isSome

Returns true if `T` is some

#### maybe

Returns `Maybe<T>` if is some, otherwise `Nothing`

#### result

If is filled, returns `Ok<T[]>`, otherwise returns `Err`;

## shorthands for some and none

```ts
import { some, none } from 'https://deno.land/x/deenvo';

some('foo');
none();
```