export type ArgsOf<Fn extends FnBase> = Fn extends (...args: infer U) => any ? U
  : any[];

export type FnBase = (...args: any[]) => any;

export function isnull(arg: unknown): arg is null {
  return arg === null;
}

export function isdate(arg: unknown): arg is Date {
  return arg instanceof Date;
}

export function isundefined(arg: unknown): arg is undefined {
  return arg === undefined;
}

export function ensureFn(arg: unknown, errormessage: string): arg is FnBase {
  if (typeof arg !== "function") {
    throw new TypeError(errormessage);
  }

  return true;
}
