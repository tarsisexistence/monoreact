// TODO: should it be styles.d.ts?

type classNames = { [className: string]: string };

declare module '*.css' {
  const classNames: classNames;
  // @ts-ignore
  export default classNames;
}

declare module '*.scss' {
  const classNames: classNames;
  // @ts-ignore
  export default classNames;
}

declare module '*.json' {
  const value: any;
  // @ts-ignore
  export default value;
}
