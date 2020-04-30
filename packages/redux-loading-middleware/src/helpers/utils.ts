export function isPromise<T>(value: null | Promise<T>): boolean {
  return value instanceof Promise;
}
