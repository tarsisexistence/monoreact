# User Guide

> This package is meant for developing React components (not apps!) that can be published to NPM. If you’re looking to build an app, you should use `create-react-app`, `razzle`, `nextjs`, `gatsby`, or `react-static`.

> If you’re new to TypeScript and React, checkout [this handy cheatsheet](https://github.com/sw-yx/react-typescript-cheatsheet/)

## Commands

Re-space scaffolds your new library inside `/src`, and also sets up a [Parcel-based](https://parceljs.org) playground for it inside `/example`.

```
yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

Then run either example playground or storybook:

### Docz

Run inside another terminal:

```
yarn docz
```

This loads the component documentation of `*.mdx` extension.

### Example

Then run the example inside another:

```
cd example
yarn install
yarn start
```

The default example imports and live reloads whatever is in `/dist`, so if you are seeing an out of date component, make sure the package is running in watch mode.

To do a one-off build, use `yarn build`.

To run tests, use `yarn test`.

### Jest

Jest tests are set up to run with `yarn test`. This runs the test watcher (Jest) in an interactive mode. By default, runs tests related to files changed since the last commit.

#### Setup Files

This is the folder structure we set up for you:

```
/example
  index.html
  index.tsx       # test your component here in a demo app
  package.json
  tsconfig.json
/src
  index.tsx       # EDIT THIS
/test
  blah.test.tsx   # EDIT THIS
.gitignore
package.json
README.md         # EDIT THIS
tsconfig.json
```

### Rollup

The package uses [Rollup v1.x](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.


## Using the Playground

```
cd example
yarn install
yarn start
```

The default example imports and live reloads whatever is in `/dist`, so if you are seeing an out of date component, make sure the package is running in watch mode like we recommend above.

## Named Exports

Per Palmer Group guidelines, [always use named exports.](https://github.com/palmerhq/typescript#exports) Code split inside your React app instead of your React library.

## Including Styles

There are many ways to ship styles, including with CSS-in-JS. Configure how you like.

For vanilla CSS, you can include it at the root directory and add it to the `files` section in your `package.json`, so that it can be imported separately by your users and run through their bundler's loader.

## Publishing to NPM

We recommend using https://github.com/sindresorhus/np.

## Usage with Lerna

When creating a new package with TSDX within a project set up with Lerna, you might encounter a `Cannot resolve dependency` error when trying to run the `example` project. To fix that you will need to make changes to the `package.json` file _inside the `example` directory_.

The problem is that due to the nature of how dependencies are installed in Lerna projects, the aliases in the example project's `package.json` might not point to the right place, as those dependencies might have been installed in the root of your Lerna project.

Change the `alias` to point to where those packages are actually installed. This depends on the directory structure of your Lerna project, so the actual path might be different from the diff below.

```diff
   "alias": {
-    "react": "../node_modules/react",
-    "react-dom": "../node_modules/react-dom"
+    "react": "../../../node_modules/react",
+    "react-dom": "../../../node_modules/react-dom"
   },
```

An alternative to fixing this problem would be to remove aliases altogether and define the dependencies referenced as aliases as dev dependencies instead. [However, that might cause other problems.](https://github.com/palmerhq/tsdx/issues/64)
