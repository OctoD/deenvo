import { DoublyLinkedListLike, doublynode, DoublyNode } from './doubly-linked-list.ts';
import { FnBase, ArgsOf } from './common.ts';
import ICallable, { CallableMethodReturnValue } from './ICallable.ts';
import { safe, safeAsync } from './safe.ts';

export class QueueLike<T extends FnBase> extends DoublyLinkedListLike<T> implements ICallable<T> {
  /**
   *
   *
   * @param {...ArgsOf<T>} args
   * @returns {CallableMethodReturnValue<T>}
   * @memberof QueueLike
   */
  public call(... args: ArgsOf<T>): CallableMethodReturnValue<T> {
    const results: CallableMethodReturnValue<T> = [];

    this.forEach(node => results.push(safe(node.value, ... args)));

    return results;
  }

  /**
   *
   *
   * @param {...ArgsOf<T>} args
   * @returns {Promise<CallableMethodReturnValue<T>>}
   * @memberof QueueLike
   */
  public async callasync(... args: ArgsOf<T>): Promise<CallableMethodReturnValue<T>> {
    const results: CallableMethodReturnValue<T> = [];

    await this.forEach(async node => results.push((await safeAsync(node.value, ... args) as ReturnType<T>)));

    return results;
  }
}

export type Queue<T extends FnBase> = QueueLike<T>;
export type Queueable<T extends FnBase> = DoublyNode<T>;

export function queueable<T extends FnBase>(fn: T): Queueable<T> {
  return doublynode(fn);
}

/**
 *
 *
 * @export
 * @template T
 * @returns {Queue<T>}
 */
export function queue<T extends FnBase>(... args: T[]): Queue<T> {
  const mystack = new QueueLike<T>();

  if (args.length > 0) {
    args.forEach(a => mystack.insert(queueable(a)));
  }

  return mystack;
}