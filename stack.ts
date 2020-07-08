import { DoublyLinkedListLike, doublynode, DoublyNode } from './doubly-linked-list.ts';
import { FnBase, ArgsOf } from './common.ts';
import ICallable, { CallableMethodReturnValue } from './ICallable.ts';
import { safe, safeAsync } from './safe.ts';

export class StackLike<T extends FnBase> extends DoublyLinkedListLike<T> implements ICallable<T> {
  /**
   *
   *
   * @param {...ArgsOf<T>} args
   * @returns {CallableMethodReturnValue<T>}
   * @memberof StackLike
   */
  public call(... args: ArgsOf<T>): CallableMethodReturnValue<T> {
    const results: CallableMethodReturnValue<T> = [];

    this.forEach(node => results.push(safe(node.value, ... args)), true);

    return results;
  }

  /**
   *
   *
   * @param {...ArgsOf<T>} args
   * @returns {Promise<CallableMethodReturnValue<T>>}
   * @memberof StackLike
   */
  public async callasync(... args: ArgsOf<T>): Promise<CallableMethodReturnValue<T>> {
    const results: CallableMethodReturnValue<T> = [];

    await this.forEach(async node => results.push((await safeAsync(node.value, ... args) as ReturnType<T>)), true);

    return results;
  }
}

export type Stack<T extends FnBase> = StackLike<T>;

export function stackable<T extends FnBase>(fn: T): DoublyNode<T> {
  return doublynode(fn);
}

/**
 *
 *
 * @export
 * @template T
 * @returns {Stack<T>}
 */
export function stack<T extends FnBase>(... args: T[]): Stack<T> {
  const mystack = new StackLike<T>();

  if (args.length > 0) {
    args.forEach(a => mystack.insert(stackable(a)));
  }

  return mystack;
}