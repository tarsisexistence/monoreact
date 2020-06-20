declare namespace CLI.Common {
  type EmptyFn = () => void;

  type Messages = Record<string, (...args: any) => string>;
}
