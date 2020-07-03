[back](README.md)

# maybe

- [maybe](#maybe)
  - [Creating a maybe monad](#creating-a-maybe-monad)
  - [Methods](#methods)
      - [isJust](#isjust)
      - [isNothing](#isnothing)
      - [option](#option)
      - [result](#result)
  - [shorthands for just and nothing](#shorthands-for-just-and-nothing)

## Creating a maybe monad

```ts
import { maybe } from 'https://deno.land/x/deenvo';

maybe(10 > 5)
```

## Methods

Maybe implements methods from

- [IAssertable](IAssertable.ts.md)
- [IConditional](IConditional.ts.md)
- [IMappable](IMappable.ts.md)
- [IUnwrappable](IUnwrappable.ts.md)

It also has it's own methods:

#### isJust

Returns `true` if is `Just<T>`

#### isNothing

Returns `true` if is `Nothing`

#### option

If is filled, returns `Option<T[]>`, otherwise returns `None`;

#### result

If is filled, returns `Ok<T[]>`, otherwise returns `Err`;

## shorthands for just and nothing

```ts
import { just, nothing } from 'https://deno.land/x/deenvo';

just(10);
nothing();
```