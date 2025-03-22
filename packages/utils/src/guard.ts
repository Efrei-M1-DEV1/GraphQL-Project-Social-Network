import type { Callable, Dict, List } from "./types";

export const isDev = () => process.env.NODE_ENV !== "production";
export const isArray = (v: unknown): v is List => Array.isArray(v);
export const isBoolean = (v: unknown): v is boolean => v === true || v === false;
export const isObjectLike = (v: unknown): v is Dict => v != null && typeof v === "object";
export const isObject = (v: unknown): v is Dict => isObjectLike(v) && !isArray(v);
export const isNumber = (v: unknown): v is number => typeof v === "number" && !Number.isNaN(v);
export const isString = (v: unknown): v is string => typeof v === "string";
export const isFunction = (v: unknown): v is Callable => typeof v === "function";
export const isNull = (v: unknown): v is null | undefined => v == null;

export const hasProp = <T extends string>(obj: unknown, prop: T): obj is Record<T, unknown> =>
  Object.prototype.hasOwnProperty.call(obj, prop);

const baseGetTag = (v: unknown) => Object.prototype.toString.call(v);
const fnToString = Function.prototype.toString;
const objectCtorString = fnToString.call(Object);

export const isPlainObject = (v: unknown) => {
  if (!isObjectLike(v) || baseGetTag(v) !== "[object Object]") {
    return false;
  }
  const proto = Object.getPrototypeOf(v);
  if (proto === null) {
    return true;
  }
  const Ctor = hasProp(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor instanceof Ctor && fnToString.call(Ctor) === objectCtorString;
};
