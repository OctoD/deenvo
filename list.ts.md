[back](README.md)

# list

- [list](#list)
  - [Creating a list](#creating-a-list)
  - [Methods](#methods)
      - [isEmpty](#isempty)
      - [len](#len)
      - [isFilled](#isfilled)
      - [maybe](#maybe)
      - [option](#option)
      - [result](#result)

## Creating a list

```ts
import { list } from 'https://deno.land/x/deenvo';

list(1, 2, 3)
```

## Methods

A List implements methods from

- [IAssertable](IAssertable.ts.md)
- [IComputedMappable](IMappable.ts.md)
- [IFilterable](IFilterable.ts.md)
- [IImmediateComparisonConditional](IConditional.ts.md)
- [IImmediateMappable](IMappable.ts.md)
- [IInsertable](IInsertable.ts.md)
- [IUnwrappable](IUnwrappable.ts.md)

It also has it's own methods:

#### isEmpty

Returns `true` if the `List<T>` is empty.

#### len

Returns `List<T>` length.

#### isFilled

Returns `true` if the `List<T>` has a least one value stored.

#### maybe

If is filled, returns `Just<T[]>`, otherwise returns `Nothing`;

#### option

If is filled, returns `Option<T[]>`, otherwise returns `None`;

#### result

If is filled, returns `Ok<T[]>`, otherwise returns `Err`;