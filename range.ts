import { ensureFn, isdate, isnumber } from './common.ts'
import { IInsertable } from './IInsertable.ts';
import { EnumerableForEachFn, IEnumerable } from './IEnumerable.ts';

export class RangeLike<T> implements IEnumerable<number, T>, IInsertable<T> {
  protected _length: number = 0;
  
  readonly [index: number]: T;

  public get length(): number {
    return this._length;
  }
  
  public constructor(args: T[]) {
    for (let i = 0; i < args.length; i++) {
      this.insert(args[i]);
    }
  }
  
  /**
   * Checks if a `Range<T>` contains a value `T` at a specific `index`
   * 
   * ```ts
   * range(1, 5).contains(12)   // false
   * range(1, 5).contains(3)    // true
   * ```
   *
   * @param {number} index
   * @returns {boolean}
   * @memberof RangeLike
   */
  public contains(index: number): boolean {
    return this[index] !== undefined;
  }

  /**
   * Loops each range item `T`
   * 
   * ```ts
   * range(1, 5).forEach(console.log) // logs 1, 2, 3, 4, 5
   * ```
   *
   * @param {EnumerableForEachFn<T>} fn
   * @param {boolean} [reversed=false]
   * @memberof RangeLike
   */
  public forEach(fn: EnumerableForEachFn<T>, reversed = false): void {
    ensureFn(fn, 'Range.forEach argument must be a function');
    
    for (
      let i = reversed ? this._length : 0; 
      reversed ? i > 0 : i < this._length; 
      reversed ? i-- : i++
    ) {
      fn(this.get(i));
    }
  }

  /**
   * Gets an item `T` at `index`. Throws if the value is undefined
   *
   * @param {number} index
   * @returns {T}
   * @memberof RangeLike
   */
  public get(index: number): T {
    if (this.contains(index)) {
      return this[index];
    }
    
    throw new ReferenceError(`Item at position {${index}} is undefined`);
  }

  /**
   * Inserts a value `T`
   * 
   * ```ts
   * range(1, 5).insert(9) // range[1, 2, 3, 4, 5, 9]
   * ```
   *
   * @param {T} arg
   * @returns
   * @memberof RangeLike
   */
  public insert(arg: T) {
    if (arg === undefined) {
      return this;
    }
    
    (this[this._length] as any) = arg;
    this._length++;
    return this;
  }

  /**
   * Removes the given argument from range
   * 
   * ```ts
   * range(5, 10).remove(7) // range[5, 6, 8, 9, 10]
   * ```
   *
   * @param {T} arg
   * @returns
   * @memberof RangeLike
   */
  public remove(arg: T) {
    let shouldreassign = undefined;
    let removed = 0;

    for (let i = 0; i < this._length; i++) {
      const element = this[i];

      if (element === arg) {
        shouldreassign = true;
        removed++;
        continue;
      }

      if (shouldreassign) {
        (this[i] as any) = undefined;
        (this[i - removed] as any) = element;
      }
    }

    this._length -= removed;

    return this;
  }

  /**
   * Returns current `Range<T>` as a `T[]`
   * 
   * ```ts
   * range(0, 5).toArray() // [0, 1, 2, 3, 4, 5];
   * ```
   *
   * @returns {T[]}
   * @memberof RangeLike
   */
  public toArray(): T[] {
    const result: T[] = [];
    this.forEach(arg => result.push(arg));
    return result;
  }
}

export type Range<T> = RangeLike<T>;

export type CalculateRangeFunction<T> = (start?: T, end?: T) => T[];

export type RangeFactoryFn<T> = (start?: T, end?: T) => Range<T>;

export function rangefactory<T>(arg: CalculateRangeFunction<T> = () => []): RangeFactoryFn<T> {
  ensureFn(arg, 'genericrange argument must be `(start?: T, end?: T) => T[]`');
  return (start?: T, end?: T) => new RangeLike(arg(start, end));
}

export const daterange = rangefactory<Date>((start, end) => {
  if (isdate(start) && isdate(end)) {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const range: Date[] = [];
    const copy = new Date(start);
    
    while (range.length <= diffDays) {
      copy.setDate(copy.getDate() + range.length);
      range.push(copy)
    }

    return range;
  } else {
    return [];
  }
});

export const range = rangefactory<number>((start, end) => {
  if (isnumber(start) && isnumber(end)) {
    const range: number[] = [];

    while (range.length <= Math.abs(start - end)) {
      range.push(start + range.length);
    }

    return range;
  } else {
    return [];
  }
}) 
