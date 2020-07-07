[back](README.md);

# IEnumerable

```ts
export interface IEnumerableQueryable<T, Container = T> {
  contains(index: number): boolean;
  get(index: number): Container;
}

export interface IEnumerableIndexable<T, Container = T> {
  readonly [index: number]: Container | undefined;
  readonly length: number;
}

export default interface IEnumerable<T, Container = T>
  extends
    IEnumerableIndexable<T, Container>,
    IEnumerableQueryable<T, Container> {}

```
