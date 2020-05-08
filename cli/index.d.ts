type styles = { [className: string]: string };

declare module '*.css' {
  const classNames: styles;
  // @ts-ignore
  export default classNames;
}

declare module '*.scss' {
  const classNames: styles;
  // @ts-ignore
  export default classNames;
}

declare module '*.json' {
  const value: any;
  // @ts-ignore
  export default value;
}
