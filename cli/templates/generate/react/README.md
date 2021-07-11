This package meant for developing React components (not applications) that can be published to NPM. If you’re looking to build an app, you should use `create-react-app`, `razzle`, `nextjs`, `gatsby`, or `react-static`.

## Commands

### Watch

**Monoreact** scaffolds your new library inside `/src`, (bonus: sets up a [Parcel-based](https://parceljs.org) playground for that package inside `/playground` to test your components inside separate index.html).

```
yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

Then run either example playground or docz.

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

### Using the Docz

Run inside another terminal:

```
yarn docz
```

This loads the component documentation of `*.mdx` extension.

### Using the Playground

You can generate playground via `monoreact add playground`

```
cd playground
yarn install
yarn start
```

The default example imports and live reloads whatever is in `/dist`, so if you are seeing an out of date component, make sure the package is running in watch mode like we recommend above.

<br/>

### Including Styles

It supports postcss, sass and modularity.

<br/>

## User Guide

> If you’re new to TypeScript and React, checkout [this handy cheatsheet](https://github.com/sw-yx/react-typescript-cheatsheet/)
