import { FnBase } from "./common.ts";
import { runtimetype, RuntimeType, isruntimeType } from "./runtimetype.ts";

//#region base data types

export const any = runtimetype("any", () => true);

export const array = runtimetype<any[]>(
  "array",
  (value) => Array.isArray(value),
);

export const bigint = runtimetype<bigint>(
  "bigint",
  (value) => typeof value === "bigint",
);

export const boolean = runtimetype<boolean>(
  "boolean",
  (value) => typeof value === "boolean",
);

export const byte = runtimetype<number>(
  "byte",
  (value) => typeof value === "number" && value >= -128 && value <= 127,
);

export const char = runtimetype<string>(
  "char",
  (value) => typeof value === "string" && value.length === 1,
);

export const defined = runtimetype<any>(
  "defined",
  (value) => typeof value !== "undefined",
);

export const float = runtimetype<number>(
  "float",
  (value) => typeof value === "number",
);

export const fn = runtimetype<FnBase>(
  "fn",
  (value) => typeof value === "function",
);

export const int = runtimetype<number>(
  "int",
  (value) => typeof value === "number" && value - Math.trunc(value) === 0,
);

export const nullable = runtimetype<number>(
  "nullable",
  (value) => typeof value === "object",
);

export const object = runtimetype<object>(
  "object",
  (value) => typeof value === "object" && value !== null,
);

export const string = runtimetype<string>(
  "string",
  (value) => typeof value === "string",
);

//#endregion

//#region derived types

export const binaryfn = fn.derive(
  "binary",
  (value) => value.length === 2,
);

export const chararray = array.derive<string[]>(
  "char",
  (value) => value.every((a) => char(a).isvalid()),
);

export const intarray = array.derive<number[]>(
  "int",
  (value) => value.every((a) => int(a).isvalid()),
);

export const floatarray = array.derive<number[]>(
  "float",
  (value) => value.every((a) => float(a).isvalid()),
);

export const plainobject = object.derive<{ [index: string]: any }>(
  "plain",
  (value) => Object.prototype.toString.call(value) === "[object Object]",
);

export const stringarray = array.derive<string[]>(
  "string",
  (value) => value.every((a) => string(a).isvalid()),
);

export const ubigint = bigint.derive(
  "u",
  (value) => typeof value === "bigint" && value >= 0,
);

export const ufloat = float.derive(
  "u",
  (value) => value >= 0 && value !== Infinity,
);

export const ufloatarray = array.derive<number[]>(
  "ufloat",
  (value) => value.every((a) => ufloat(a).isvalid()),
);

export const uint = int.derive(
  "u",
  (value) =>
    value >= 0 &&
    value !== Infinity,
);

export const uintarray = array.derive<number[]>(
  "uint",
  (value) => value.every((a) => uint(a).isvalid()),
);

export const unaryfn = fn.derive(
  "unary",
  (value) => value.length === 1,
);

//#endregion

//#region impl

export interface IImpl {
  [index: string]: ReturnType<any> & IImpl;
}

export type ImplOf<T extends IImpl> = {
  [key in keyof T]: T[key] extends RuntimeType<infer U> ? U : ImplOf<T[key]>;
};

export type ImplFn<T extends IImpl> = RuntimeType<ImplOf<T>>;

export const impl = <T extends IImpl>(arg: T): ImplFn<T> => {
  const validate = (currentschema: IImpl, currentvalue: any): boolean => {
    const keys = Object.keys(currentschema);

    return keys.every((key) => {
      const typeorimpl = currentschema[key];
      const inspectedvalue = currentvalue[key];

      return isruntimeType(typeorimpl)
        ? typeorimpl(inspectedvalue).isvalid()
        : validate(typeorimpl, inspectedvalue);
    });
  };

  return plainobject.derive(
    "impl",
    (value) => validate(arg, value),
  );
};

//#endregion
