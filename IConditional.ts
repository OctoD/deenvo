export type ConditionalFn<T, U> = (arg: T) => U;

export interface IComputedComparisonConditional<T> {
  /**
   * If `T` is a contained valid value, should call `fn` and return a `IComputedComparisonConditional<ReturnValue<fn>>` container, otherwise it should return `IComputedComparisonConditional<T>`
   *
   * @template U
   * @param {ConditionalFn<T, U>} fn
   * @returns {(IComputedComparisonConditional<T | U>)}
   * @memberof IComputedComparisonConditional
   */
  andThen<U>(fn: ConditionalFn<T, U>): IComputedComparisonConditional<T | U>;
  /**
   * If `T` is a contained valid value, it should return `IComputedComparisonConditional<T>` , otherwise it should call `fn` and return a `IComputedComparisonConditional<ReturnValue<fn>>` container
   *
   * @template U
   * @param {ConditionalFn<T, U>} fn
   * @returns {(IComputedComparisonConditional<T | U>)}
   * @memberof IComputedComparisonConditional
   */
  orThen<U>(fn: ConditionalFn<T, U>): IComputedComparisonConditional<T | U>;
}

export interface IImmediateComparisonConditional<T> {
  /**
   * If `T` is valid, it should return `other`, otherwise it should return `IImmediateComparisonConditional<T>`
   *
   * @template U
   * @param {IImmediateComparisonConditional<U>} other
   * @returns {(IImmediateComparisonConditional<T | U>)}
   * @memberof IImmediateComparisonConditional
   */
  and<U>(
    other: IImmediateComparisonConditional<U>,
  ): IImmediateComparisonConditional<T | U>;
  /**
   * If `T` is valid, it should return `IImmediateComparisonConditional<T>`, otherwise it should return `other`
   *
   * @template U
   * @param {IImmediateComparisonConditional<U>} other
   * @returns {(IImmediateComparisonConditional<T | U>)}
   * @memberof IImmediateComparisonConditional
   */
  or<U>(
    other: IImmediateComparisonConditional<U>,
  ): IImmediateComparisonConditional<T | U>;
}

export interface IConditional<T>
  extends
    IImmediateComparisonConditional<T>,
    IComputedComparisonConditional<T> {}
