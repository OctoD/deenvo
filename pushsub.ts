import { ArgsOf, ensureFn, FnBase } from "./common.ts";

export type UnsubscriberFn = () => boolean;

export type PushSub<Fn extends FnBase> = {
  /**
   * Notifies subscribed functions `Fn`
   * @param {...ArgsOf<Fn>} args
   */
  notify(...args: ArgsOf<Fn>): void;
  /**
   * Subscribes a function `Fn`. Returns an unsubscriber function.
   * @param {Fn} fn
   * @returns {UnsubscriberFn}
   */
  subscribe(fn: Fn): UnsubscriberFn;
};

function createnotifier<Fn extends FnBase>(
  subscribers: Set<Fn>,
): PushSub<Fn>["notify"] {
  return (...args) => {
    for (let callable of subscribers) {
      callable.apply(null, args);
    }
  };
}

function createsubscriber<Fn extends FnBase>(
  subscribers: Set<Fn>,
): PushSub<Fn>["subscribe"] {
  return (fn) => {
    ensureFn(fn, 'PushSub.subscribe fn argument must be a function');
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  };
}

/**
 * Creates a PushSub<Fn>
 *
 * @export
 * @template Fn
 * @returns {PushSub<Fn>}
 */
export function pushsub<Fn extends FnBase = () => any>(): PushSub<Fn> {
  const subscribers: Set<Fn> = new Set();
  const notify = createnotifier(subscribers);
  const subscribe = createsubscriber(subscribers);

  return { notify, subscribe };
}
