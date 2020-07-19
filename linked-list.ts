import { IInsertable } from "./IInsertable.ts";
import { IImmediateMappable, MappableFn } from "./IMappable.ts";
import { IEnumerableQueryable } from "./IEnumerable.ts";
import { ok, err, Result } from "./result.ts";
import { ensureFn } from "./common.ts";

export class LinkedListLike<T>
  implements
    IEnumerableQueryable<T, Result<Node<T>>>,
    IInsertable<Node<T>>,
    IImmediateMappable<T> {
  protected _head?: Node<T>;
  protected _tail?: Node<T>;

  /**
   * Checks if `LinkedList<T>` contains the given index
   *
   * @param {number} index
   * @returns {boolean}
   * @memberof LinkedListLike
   */
  public contains(index: number): boolean {
    let current = this._head;

    for (let i = 0; i < index; i++) {
      if (!current) {
        return false;
      }

      current = current.next;
    }

    return current !== undefined;
  }

  /**
   * Returns `Ok<Node<T>>` if the index is in range, otherwise returns `Err`
   *
   * @param {number} index
   * @returns {Result<Node<T>>}
   * @memberof LinkedListLike
   */
  public get(index: number): Result<Node<T>> {
    const errormessage = `Index ${index} is out of range`;

    if (index < 0) {
      return err(errormessage);
    }

    let current = this._head;

    for (let i = 0; i < index; i++) {
      if (!current) {
        break;
      }

      current = current.next;
    }

    if (!current) {
      return err(errormessage);
    }

    return ok(current);
  }

  /**
   * Inserts a new `Node<T>` at the end of the list
   *
   * @param {Node<T>} nodetoadd
   * @returns {LinkedList<T>}
   * @memberof LinkedListLike
   */
  public insert(nodetoadd: Node<T>): LinkedList<T> {
    if (!this._head) {
      this._head = nodetoadd;
      this._tail = nodetoadd;
    } else if (this._tail) {
      this._tail.next = nodetoadd;
      this._tail = nodetoadd;
    }

    return this;
  }

  /**
   * Returns if the list is empty
   *
   * @returns {boolean}
   * @memberof LinkedListLike
   */
  public isempty(): boolean {
    return !this.isfilled();
  }

  /**
   * Returns if the list is filled
   *
   * @returns {boolean}
   * @memberof LinkedListLike
   */
  public isfilled(): boolean {
    return !!this._head && !!this._tail;
  }

  /**
   * Maps the `LinkedList<T>` to `LinkedList<U>` if filled, otherwise returns `LinkedList<T>`
   * 
   * ```ts
   * linkedlist().insert(node(1000)).map(String) // LinkedList(Node('1000'))
   * ````
   *
   * @template U
   * @param {MappableFn<T, U>} fn
   * @returns {(LinkedList<T | U>)}
   * @memberof LinkedListLike
   */
  public map<U>(fn: MappableFn<T, U>): LinkedList<T | U> {
    ensureFn(fn, "LinkedList.map fn argument must be a function");

    if (this.isempty()) {
      return this;
    }

    const copy = new (this.constructor as any)() as LinkedList<U>;
    let current = this._head;

    while (current) {
      copy.insert(node(fn(current.value)));
      current = current.next;
    }

    return copy;
  }

  /**
   * Removes the first element (head) of `LinkedList<T>`
   *
   * @returns {LinkedList<T>}
   * @memberof LinkedListLike
   */
  public remove(): LinkedList<T> {
    if (this._head) {
      this._head = this._head.next;

      if (!this._tail) {
        this._tail = this._head!.next;
      }
    }

    return this;
  }
}

export type LinkedList<T> = LinkedListLike<T>;

export type Node<T> = {
  next?: Node<T>;
  value: T;
};

/**
 * Creates a new `LinkedList<T>`
 *
 * @export
 * @template T
 * @returns {LinkedList<T>}
 */
export function linkedlist<T>(): LinkedList<T> {
  return new LinkedListLike();
}

/**
 * Creates a new `Node<T>`
 *
 * @export
 * @template T
 * @param {T} value
 * @returns {Node<T>}
 */
export function node<T>(value: T): Node<T> {
  return { value };
}
