export type FilterableFn<T> = (arg: T) => boolean;

export interface IFilterable<T> {
  /**
   * Filters the contained value `T` with a given predicate `fn`. It should return a valid container `IFilterable<T>`
   *
   * @param {FilterableFn<T>} fn
   * @returns {IFilterable<T>}
   * @memberof IFilterable
   */
  filter(fn: FilterableFn<T>): IFilterable<T>;
  /**
   * Filters the contained value `T` with a given predicate `fn` and it should return a valid container `IFilterable<T>`, otherwise it should return `def`
   *
   * @param {IFilterable<T>} def
   * @param {FilterableFn<T>} fn
   * @returns {IFilterable<T>}
   * @memberof IFilterable
   */
  filterOr(def: IFilterable<T>, fn: FilterableFn<T>): IFilterable<T>;
}
