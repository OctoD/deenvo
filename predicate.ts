/**
 * @template T
 * @type {Predicate<T>}
 */
export type Predicate<T> = (arg: T) => boolean;

/**
 * Combines two or more predicates in one. The resulting predicate will return true if 
 * all predicates are satisfied
 * 
 * @example
 * const isString = (arg: unknown): arg is string => typeof arg === 'string';
 * const hasLength = (length: number) => (arg: unknown): boolean => isString(arg) && arg.length >= length;
 * const contains = (str: string) => (arg: unknown): boolean => isString(arg) && arg.contains(str);
 * 
 * const combined = and(isString, hasLength(4), contains('foo'))
 * 
 * combined('foobarbaz'); // true
 * combined('helloworld'); // false
 * combined('foo'); // false
 * 
 * @template T
 * @param {...Predicate<T>[]} predicates a list of predicates to combine with AND rule (&&)
 * @returns {Predicate<T>} 
 */
export const and = <T>(...predicates: Predicate<T>[]): Predicate<T> =>
  (argument) => predicates.every(fromvalue(argument));

/**
 * Creates a new function which accepts a predicate. This predicate will check
 * the given value
 * 
 * @example
 * const iseven = (arg: number) => arg % 2 === 0;
 * const isodd  = revers(iseven);
 * const check1 = fromvalue(1);
 * const check2 = fromvalue(2);
 * 
 * check1(iseven)   // false
 * check1(isodd)    // true
 * check2(iseven)   // true
 * check2(isodd)    // false
 *
 * @template T
 * @param {T} value the value to check
 */
export const fromvalue = <T>(value: T) =>
  (predicate: Predicate<T>) => predicate(value);

/**
 * Returns a function which checks if every value T passes a given predicate
 * 
 * @example
 * const test1 = fromvalues(1, 2, 3, 4, 5);
 * const test2 = fromvalues(2, 4, 6, 8);
 * const iseven = (arg: number) => arg % 2 === 0;
 * 
 * test1(iseven); // false
 * test2(iseven); // true
 *
 * @template T
 * @param {...T} values
 */
export const fromvalues = <T>(...values: T[]) =>
  (predicate: Predicate<T>) => values.every(predicate);

/**
 * Combines two or more predicates into one. The returned predicate
 * will check if no conditions are met.
 * 
 * @example
 * const isnumber = (arg: unknown): arg is number => typeof arg === 'number';
 * const isstring = (arg: unknown): arg is string => typeof arg === 'string';
 * const isnull = (arg: unknown): arg is null => typeof arg === 'null';
 * const isundefined = (arg: unknown): arg is undefined => typeof arg === 'null';
 * 
 * const noneOfTheAbove = noneof(isnumber, isstring, isnull, isundefined);
 * 
 * noneOfTheAbove(10)             // false
 * noneOfTheAbove('hello world')  // false
 * noneOfTheAbove(null)           // false
 * noneOfTheAbove(undefined)      // false
 *
 * @template T
 * @param {...Predicate<T>[]} predicates
 * @returns {Predicate<T>}
 */
export const noneof = <T>(...predicates: Predicate<T>[]): Predicate<T> =>
  (argument) => predicates.every(reverse(fromvalue(argument)));

/**
 * Combines two or more predicates in one. The returned predicate will
 * check if at least one condition passes.
 * 
 * @example
 * const isester = fromvalue('Ester');
 * const isjoe = fromvalue('Joe');
 * const islisa = fromvalue('Lisa');
 * 
 * const orfn = or(isester, isjoe, islisa);
 * 
 * orfn('Ester');       // true
 * orfn('Lisa');        // true
 * orfn('Joe');         // true
 * orfn('Alexander');   // false
 *
 * @template T
 * @param {...Predicate<T>[]} predicates
 * @returns {Predicate<T>}
 */
export const or = <T>(
  ...predicates: Predicate<T>[]
): Predicate<T> => (argument) => predicates.some(fromvalue(argument));

/**
 * Reverses the result of a predicate.
 * 
 * @example
 * const iseven = (arg: number) => arg % 2 === 0;
 * const isodd = reverse(iseven);
 * 
 * iseven(2)  // true
 * isodd(2)   // false
 * isodd(1)   // true
 *
 * @template T
 * @param {Predicate<T>} arg
 * @returns {Predicate<T>}
 */
export const reverse = <T>(arg: Predicate<T>): Predicate<T> =>
  (argument) => !arg(argument);

/**
 * Creates a new Predicate<T> which checks if the given argument is not the same as the 
 * one passed to the predicate.
 * 
 * @example
 * const isnotjoe = withdifferentvalue('Joe');
 * 
 * isnotjoe('John');  // true
 * isnotjoe('Lisa');  // true
 * isnotjoe('Joe');   // false
 *
 * @template T
 * @param {T} unexpectedvalue the value you expect not to be there
 * @returns {Predicate<T>}
 */
export const withdifferentvalue = <T>(unexpectedvalue: T): Predicate<T> =>
  (argument) => argument !== unexpectedvalue;

/**
 * Creates a new Predicate<T> which checks if the given argument is the same as the 
 * one passed to the predicate.
 * 
 * @example
 * const isnotjoe = withsamevalue('Joe');
 * 
 * isnotjoe('John');  // false
 * isnotjoe('Lisa');  // false
 * isnotjoe('Joe');   // true
 *
 * @template T
 * @param {T} expectedvalue the value you expect not to be there
 * @returns {Predicate<T>}
 */
export const withsamevalue = <T>(expectedvalue: T): Predicate<T> =>
  (argument) => argument === expectedvalue;
