export default interface IInsertable<T> {
  /**
   * It inserts a value `T`
   *
   * @param {T} arg
   * @returns {IInsertable<T>}
   * @memberof IInsertable
   */
  insert(arg: T): IInsertable<T>;
  /**
   * It removes all values `T`
   *
   * @param {T} arg
   * @returns {IInsertable<T>}
   * @memberof IInsertable
   */
  remove(arg: T): IInsertable<T>;
}
