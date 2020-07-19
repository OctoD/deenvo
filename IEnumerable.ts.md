[back](README.md);

# IEnumerable

```ts
export type EnumerableForEachFn<Container> = (arg: Container) => any;

export interface IEnumerableIterable<T, Container = T> {
  forEach(fn: EnumerableForEachFn<Container>): void;
  forEach(fn: (arg: Container) => any, reversed: boolean): void;
}

export interface IEnumerableQueryable<T, Container = T> {
  contains(index: number): boolean;
  get(index: number): Container;
}

export interface IEnumerableIndexable<T, Container = T> {
  readonly [index: number]: Container | undefined;
  readonly length: number;
}

export interface IEnumerable<T, Container = T>
  extends
    IEnumerableIndexable<T, Container>,
    IEnumerableIterable<T, Container>,
    IEnumerableQueryable<T, Container> {}
```
