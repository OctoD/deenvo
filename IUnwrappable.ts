export type UnwrappableFn<T> = () => T;

export interface IUnwrappable<T> {
  /**
   * It should unwrap contained value `T` if is valid, otherwise it should throw an Error
   *
   * @param {string} [errormessage]
   * @returns {(T | never)}
   * @memberof IUnwrappable
   */
  unwrap(errormessage?: string): T | never;

  /**
   * It should unwrap contained value `T` if is valid, otherwise it should return `def`
   *
   * @param {T} def
   * @returns {T}
   * @memberof IUnwrappable
   */
  unwrapOr(def: T): T;

  /**
   * It should unwrap contained value `T` if is valid, otherwise it should call `defFn` and return it's `ReturnValue<typeof defFn>`
   *
   * @param {UnwrappableFn<T>} defFn
   * @returns {T}
   * @memberof IUnwrappable
   */
  unwrapOrElse(defFn: UnwrappableFn<T>): T;
}
