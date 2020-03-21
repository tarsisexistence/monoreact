type styles = { [className: string]: string };

declare module '*.css' {
  const classNames: styles;
  // eslint-disable-next-line import/no-default-export
  export default classNames;
}

declare module '*.scss' {
  const classNames: styles;
  // eslint-disable-next-line import/no-default-export
  export default classNames;
}

declare module '*.json' {
  const value: any;
  // eslint-disable-next-line import/no-default-export
  export default value;
}

declare namespace YarnWorkspaces {
  type Packages = string[];

  interface Config {
    packages: Packages;
    nohoist?: Packages;
  }
}
