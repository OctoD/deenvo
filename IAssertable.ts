export interface IAssertable<T> {
  /**
   * If the contained value is expected, it should not throw and returns the container `IAssertable<T>`
   *
   * @param {string} message
   * @returns {(IAssertable<T> | never)}
   * @memberof IAssertable
   */
  expect(message: string): IAssertable<T> | never;
  /**
   * If the contained value is unexpected, it should not throw and returns the container `IAssertable<T>`
   *
   * @param {string} message
   * @returns {(IAssertable<T> | never)}
   * @memberof IAssertable
   */
  unexpect(message: string): IAssertable<T> | never;
}
