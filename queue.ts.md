[back](README.md)

# queue

- [queue](#queue)
  - [Creating a queue](#creating-a-queue)
  - [Methods](#methods)

## Creating a queue

```ts
import { queue, queueable } from 'https://deno.land/x/deenvo';

queue(() => 10, () => 20, () => 30);
```

## Methods

Inherits methods from `DoublyLinkedList<T>`.

Implements methods from

* [ICallable](ICallable.ts.md)

