This package meant for developing React components (not applications) that can be published to NPM. If you’re looking to build an app, you should use `create-react-app`, `razzle`, `nextjs`, `gatsby`, or `react-static`.

## Commands

### Serve

**Monoreact** scaffolds your new library inside `/src`:

```
yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

### Build

When you need to build your package without watching changes:

```
yarn build
```

The output will be available inside `/dist`

### Lint

**Monoreact** provides predefined `eslint` configuration (available only workspace project at the moment):

```
yarn lint
```

### Jest

Jest tests are set up to run with `yarn test`. This runs the test watcher (Jest) in an interactive mode. By default, runs tests related to files changed since the last commit.

### Rollup

The package uses [Rollup v2.x](https://rollupjs.org) as a bundler and generates one rollup config for ES module format and build settings.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

<br/>

## User Guide

> If you’re new to TypeScript, checkout [this handy cheatsheet](https://github.com/sw-yx/react-typescript-cheatsheet/)
