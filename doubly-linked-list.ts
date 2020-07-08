import { EnumerableForEachFn, IEnumerableIterable } from './IEnumerable.ts';
import { MappableFn } from './IMappable.ts';
import { LinkedListLike, Node, node } from './linked-list.ts';
import { Result } from './result.ts';

export class DoublyLinkedList<T> extends LinkedListLike<T> implements IEnumerableIterable<T, DoublyNode<T>> {
  protected _head?: DoublyNode<T>;
  protected _tail?: DoublyNode<T>;

  public get(index: number): Result<DoublyNode<T>> {
    return super.get(index);
  }

  public forEach(fn: EnumerableForEachFn<DoublyNode<T>>, reversed = false): void {
    let current = reversed ? this._tail : this._head;

    if (!current) {
      return;
    }

    while (current) {
      fn(current);
      current = reversed ? current.prev : current.next;
    }
  }

  public insert(node: DoublyNode<T>): DoublyLinkedList<T> {
    const tailreference = this._tail;
    
    super.insert(node);

    if (tailreference) {
      node.prev = tailreference;
    }
    
    return this;
  }

  public map<U>(fn: MappableFn<T, U>): DoublyLinkedList<T | U> {
    if (this.isempty()) {
      return this;
    }

    const mapresult = doublylinkedlist<U>();
    
    let current = this._head;

    while (current) {
      mapresult.insert(doublynode(fn(current.value)));
      current = current.next;
    }

    return mapresult;
  }
}

export type DoublyNode<T> = Node<T> & { prev?: DoublyNode<T> };

export function doublynode<T>(value: T): DoublyNode<T> {
  return node(value);
}

export function doublylinkedlist<T = unknown>(): DoublyLinkedList<T> {
  return new DoublyLinkedList();
}
