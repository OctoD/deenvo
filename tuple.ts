export interface TupleLike {
  indexOf(value: unknown): number;
  keys(): number[];
  size(): number;
}

export type Tuple<T extends any[]> = Omit<Readonly<T>, keyof Array<any>>;

/**
 * Creates a tuple with the given arguments. Tuples are immutable.
 * 
 * ```ts
 * const mytuple = tuple(10, 20, 'helloworld');
 * 
 * console.log(mytuple[2])          // 'helloworld';
 * console.log(mytuple.keys())      // [0, 1, 2];
 * console.log(mytuple.indexOf(20)) // 1;
 * console.log(mytuple.size())      // 3;
 * ```
 *
 * @export
 * @template T
 * @param {...T} args
 * @returns {(Tuple<T> & TupleLike)}
 */
export function tuple<T extends any[]>(...args: T): Tuple<T> & TupleLike {
  const keys: number[] = [];
  const tuplelike = {} as any;

  for (let i = 0; i < args.length; i++) {
    keys[i] = i;
    tuplelike[i] = args[i];
  }

  return Object.freeze({
    ...tuplelike,
    indexOf: (value: T[keyof T]) => args.indexOf(value),
    keys: () => keys,
    size: () => args.length,
  });
}
