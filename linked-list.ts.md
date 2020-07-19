[back](README.md)

# linked list

## Creating a linked list

```ts
import { linkedlist, node } from 'https://deno.land/x/deenvo';

linkedlist<number>().insert(node(10))
```

## Methods

`LinkedList<T>` implements methods from

* [IEnumerableQueryable](IEnumerable.ts.md)
* [IInsertable](IInsertable.ts.md)
* [IImmediateMappable](IMappable.ts.md)

It also has it's own methods:

#### isempty

Returns if `LinkedList<T>` is empty

#### isfilled

Returns if `LinkedList<T>` is filled (has elements)