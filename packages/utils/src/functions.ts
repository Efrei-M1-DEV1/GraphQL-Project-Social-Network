import type { List, VoidFunction } from "./types";

export const runIfFn = <T>(
  v: T | undefined,
  ...a: T extends VoidFunction ? Parameters<T> : never
): T extends VoidFunction ? NonNullable<ReturnType<T>> : NonNullable<T> => {
  const res = typeof v === "function" ? v(...a) : v;
  return res ?? undefined;
};

export const cast = <T>(v: unknown): T => v as T;

export const noop = () => {};

export const callAll =
  <T extends VoidFunction>(...fns: (T | undefined)[]) =>
  (...a: Parameters<T>) => {
    for (const fn of fns) {
      fn?.(...a);
    }
  };

export const uuid = /*#__PURE__*/ (() => {
  let id = 0;
  return () => {
    id++;
    return id.toString(36);
  };
})();

export function match<V extends string | number = string, R = unknown>(
  key: V,
  record: Record<V, R | ((...args: List) => R)>,
  ...args: List
): R {
  if (key in record) {
    const fn = record[key] as R | ((...args: List) => R);
    return typeof fn === "function" ? (fn as (...args: List) => R)(...args) : fn;
  }

  const error = new Error(`No matching key: ${JSON.stringify(key)} in ${JSON.stringify(Object.keys(record))}`);
  Error.captureStackTrace?.(error, match);

  throw error;
}

export const tryCatch = <R>(fn: () => R, fallback: () => R) => {
  try {
    return fn();
  } catch (error) {
    if (error instanceof Error) {
      Error.captureStackTrace?.(error, tryCatch);
    }
    return fallback?.();
  }
};
