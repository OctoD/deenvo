export type MappableFn<T, U> = (arg: T) => U;

export interface IImmediateMappable<T> {
  /**
   * Maps a value `T` to `U` if `T` is a valid contained value. If valid it should return `IImmediateMappable<U>`, otherwise it should return `IImmediateMappable<T>`
   *
   * @template U
   * @param {MappableFn<T, U>} fn
   * @returns {(IImmediateMappable<T | U>)}
   * @memberof IImmediateMappable
   */
  map<U>(fn: MappableFn<T, U>): IImmediateMappable<T | U>;
}
export interface IComputedMappable<T> {
  /**
   * Maps a value `T` to `U` if `T` is a valid contained value. If valid it should return `IImmediateMappable<U>`, otherwise it should return `def`
   *
   * @template U
   * @param {IComputedMappable<U>} def
   * @param {MappableFn<T, U>} fn
   * @returns {(IComputedMappable<T | U>)}
   * @memberof IComputedMappable
   */
  mapOr<U>(
    def: IComputedMappable<U>,
    fn: MappableFn<T, U>,
  ): IComputedMappable<T | U>;
}

export interface ITernaryComputedMappable<T> {
  /**
   * Maps a value `T` to `U` if `T` is a valid contained value. If valid it should return `IImmediateMappable<U>`, otherwise it should call `defFn` and returns `ITernaryComputedMappable<ReturnType<fn>>`
   *
   * @template U
   * @param {MappableFn<T, U>} defFn
   * @param {MappableFn<T, U>} fn
   * @returns {(ITernaryComputedMappable<T | U>)}
   * @memberof ITernaryComputedMappable
   */
  mapOrElse<U>(
    defFn: MappableFn<T, U>,
    fn: MappableFn<T, U>,
  ): ITernaryComputedMappable<T | U>;
}

export default interface IMappable<T>
  extends
    IImmediateMappable<T>,
    IComputedMappable<T>,
    ITernaryComputedMappable<T> {}
