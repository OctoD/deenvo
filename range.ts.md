[back](README.md)

# range

- [range](#range)
  - [Using a range](#using-a-range)
  - [Creating your own range](#creating-your-own-range)
  - [Methods](#methods)
      - [ToArray](#toarray)

## Using a range

```ts
import { common, daterange, range, rangefactory } from 'https://deno.land/x/deenvo';

const doublednumbersrange = rangefactory<number>((start, end) => {
  const range: number[] = [];
  
  if (common.isnumber(start) && common.isnumber(end)) {
    while (range.length <= Math.abs(start - end)) {
      range.push((start + range.length) * 2);
    }
  }

  return range;
});

daterange(new Date('2020-01-01', '2020-01-05'));
range(0, 9).toArray(); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

## Creating your own range

```ts
import { common, rangefactory } from 'https://deno.land/x/deenvo';

export const randomnumbers = rangefactory<number>((start, end) => {
  const result: number[] = [];
  
  if (common.isnumber(start) && common.isnumber(end)) {
    while (result.length <= Math.abs(start - end)) {
      result.push(Math.random());
    }
  }

  return result;
});
```

## Methods

Implements methods from

* [IEnumerable](IEnumerable.ts.md)
* [IInsertable](IInsertable.ts.md)

It also has it's own method:

#### ToArray

Returns the current range as an `Array<T>`
