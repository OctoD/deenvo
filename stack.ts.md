[back](README.md)

# stack

- [stack](#stack)
  - [Creating a stack](#creating-a-stack)
  - [Methods](#methods)

## Creating a stack

```ts
import { stack, stackable } from 'https://deno.land/x/deenvo';

stack(() => 10, () => 20, () => 30);
```

## Methods

Inherits methods from `DoublyLinkedList<T>`.

Implements methods from

* [ICallable](ICallable.ts.md)

