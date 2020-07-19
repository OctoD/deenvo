[back](README.md)

# doubly linked list

- [doubly linked list](#doubly-linked-list)
  - [Creating a doubly linked list](#creating-a-doubly-linked-list)
  - [Methods](#methods)

## Creating a doubly linked list

```ts
import { doublylinkedlist, doublynode } from 'https://deno.land/x/deenvo';

doublylinkedlist<number>().insert(doublynode(10))
```

## Methods

`DoublyLinkedList<T>` inherits methods from `LinkedList<T>`

`DoublyLinkedList<T>` implements methods from

* [IEnumerableIterable](IEnumerable.ts.md)
