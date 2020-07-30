[back](README.md)

# ICallable

```ts
export type CallableMethodReturnValue<T extends FnBase> = Array<Result<ReturnType<T>>>;

export interface ICallable<T extends FnBase> {
  /**
   * Calls with the given arguments `ArgsOf<T>`
   *
   * @param {...ArgsOf<T>} args
   * @returns {CallableMethodReturnValue<T>}
   * @memberof ICallable
   */
  call(... args: ArgsOf<T>): CallableMethodReturnValue<T>;
  /**
   * Async calls with the given arguments `ArgsOf<T>`
   *
   * @param {...ArgsOf<T>} args
   * @returns {Promise<CallableMethodReturnValue<T>>}
   * @memberof ICallable
   */
  callasync(... args: ArgsOf<T>): Promise<CallableMethodReturnValue<T>>;
}
```