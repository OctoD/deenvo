[back](README.md)

# result

- [result](#result)
  - [Creating a result type](#creating-a-result-type)
  - [Methods](#methods)
      - [isErr](#iserr)
      - [isOk](#isok)
      - [maybe](#maybe)
      - [option](#option)
  - [shorthands for ok and err](#shorthands-for-ok-and-err)

## Creating a result type

```ts
import { result } from 'https://deno.land/x/deenvo';

result('hello world')
```

## Methods

Maybe implements methods from

- [IAssertable](IAssertable.ts.md)
- [IConditional](IConditional.ts.md)
- [IMappable](IMappable.ts.md)
- [IUnwrappable](IUnwrappable.ts.md)

It also has it's own methods:

#### isErr

Returns `true` if the `Result<T>` is an error

#### isOk

Returns `true` if the `Result<T>` is ok

#### maybe

Returns `Maybe<T>` if is some, otherwise `Nothing`

#### option

If is ok, returns a `Some<T>`, otherwise `None`;

## shorthands for ok and err

```ts
import { ok, err } from 'https://deno.land/x/deenvo';

ok(12n);
err('this is an error');
```