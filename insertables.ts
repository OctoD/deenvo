export type DeleteFn<T, U> = (subject: T) => (arg: U) => T;

export type InsertFn<T, U> = (subject: T) => (arg: U) => T;

/**
 *
 *
 * @template T
 * @template U
 * @param {DeleteFn<T, U>} deletefn
 */
export const createDelete = <T, U>(deletefn: DeleteFn<T, U>) =>
  (subject: T) => (arg: U) => deletefn(subject)(arg);

/**
 *
 *
 * @template T
 * @template U
 * @param {InsertFn<T, U>} insertfn
 */
export const createInsert = <T, U>(insertfn: InsertFn<T, U>) =>
  (subject: T) => (arg: U) => insertfn(subject)(arg);
