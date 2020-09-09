export declare interface TypesTable {
  [index: string]: unknown;
}

export type _ = undefined;

export type ArgsOf<Fn extends FnBase> = Fn extends (...args: infer U) => any ? U
  : any[];

export type FnBase = (...args: any[]) => any;

export type NullOrUndefined = null | undefined;

export const typetables = {} as TypesTable;

export const bind = <Fn extends FnBase>(fn: Fn, ...args: ArgsOf<Fn>): Fn =>
  fn.bind(null, ...args) as Fn;

/**
 * Checks if a given condition is true, otherwise throws an error with the given error message
 * 
 * @example
 * check(true, 'does not throw')(10)        // 10
 * check(true, 'does not throw')('hello')   // 'hello'
 * check(false, 'this throws')('hello')     // Uncaught Error: this throws
 *
 * @param {boolean} condition
 * @param {string} errormessage
 * @returns {<T>(arg: T): T | never}
 */
export const check = (condition: boolean, errormessage: string) =>
  <T>(arg: T): T | never => condition ? arg : panic(errormessage);

/**
 * Adds a type to typetables const
 *
 * @template Key
 * @param {Key} key
 * @param {TypesTable[Key]} arg
 * @returns {void}
 */
export const definetype = <Key extends keyof TypesTable>(
  key: Key,
  arg: TypesTable[Key],
) => {
  typetables[key] = arg;
};

/**
 * Throws an error with the given message
 *
 * @template E
 * @param {string} message
 * @param {E} [ctor=Error as E]
 * @returns {never}
 */
export const panic = <E extends ErrorConstructor>(
  message: string,
  ctor: E = Error as E,
): never => {
  throw new ctor(message);
};
