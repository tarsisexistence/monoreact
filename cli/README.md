### What is it

This is an advanced workspace implementation for React projects.

**Monoreact** includes the following features:

- develop regular react apps
- scaffold React projects
- build JavaScript, TypeScript, React libraries
- implement monorepos, workspaces, submodules
- workspace, submodules management
- efficient bundling (rollup)
- workspace dependency awareness (topological sorting)

<br/>

### What problems does it solve

- [microfrontend](https://martinfowler.com/articles/micro-frontends.html)
- [monolithic repository, monorepo](https://www.perforce.com/blog/vcs/what-monorepo)
- [workspaces](https://www.smashingmagazine.com/2019/07/yarn-workspaces-organize-project-codebase-pro/)
- [submodules](https://chrisjean.com/git-submodules-adding-using-removing-and-updating/)

<br/>

### Motivation

The primary motivation was not to be tied to existing solutions of vendors, so as not to get into vendor lock.

Nevertheless, I recommend considering alternative solutions:

- [nx/react](https://nx.dev/react) - a super powerful tool that can do everything, but turned out to be redundant for me because of vendor lock.
- [lerna](https://github.com/lerna/lerna) - completely threw this idea away with existing yarn workspaces and git submodules scripts.
- [tsdx](https://github.com/jaredpalmer/tsdx) - a great solution but for narrow tasks.

<br/>

### What can it do now

- scaffold and build React applications with [create-react-app](https://create-react-app.dev/)
- bundle packages with [rollup](https://rollupjs.org/guide/en/)
- use advanced CLI [monoreact](https://github.com/untaggable/monoreact/tree/master/cli)
- save your time with [typescript](https://www.typescriptlang.org/) (with the option not to use it)
- symlinking [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces)
- enjoy configured testing ([jest](https://jestjs.io/)), formatting ([prettier](https://prettier.io/)), linting ([eslint](https://eslint.org/) + [stylelint](https://stylelint.io/)), git hooks ([husky](https://github.com/typicode/husky) + [lint-staged](https://github.com/okonet/lint-staged))

<br/>

### Powerful CLI

Built-in documentation. Type in the console `monoreact --help` to see information about all possible commands and `monoreact [command] --help` their description.

The following options are now available:

#### Scaffolding

- **new**. Creates a container/host/shell application. This is the initial scaffolding of the entire application.
- **generate** a new package (submodule): basic, react. Monoreact creates a distribution of responsibility. Not all packages must deal with react components. Sometimes you want to build plain JavaScript/TypeScript libraries.
- **add** a new feature (available options: docz, playground (run packages locally inside the package workspace)). Monoreact allows you to not generate components with all the things that may not necessarily need in each package.

#### Execution

- **build** and **watch** your package with a modern rollup module bundler. Rollup is the best choice for building independent libraries due to efficient tree-shaking and fast compilation.
- **test** and **lint** your package with Jest and eslint. These built-in packages are crucial for increasing and maintaining the quality of built libraries.
- **install** dependencies. This option provides workspace dependency management. If you are running **install** inside some package, it'll add these dependencies as "peer" and add them to the root.

#### Submodules

It is quite challenging for managing git submodules. You have to perform many actions to make a simple task happen, and this is what scares people off from using submodules. In turn, Monoreact offers user-friendly control through commands, which increases understanding and speed of interaction with git submodules.

- **checkout**
- **fetch**
- **init**
- **pull**

#### Workspaces

Monoreact offers a much efficient alternative to the "yarn workspaces". It analyzes your dependencies between workspaces and runs them in the desired sequence and in parallel, when necessary and appropriate.

- **watch** (parallel)
- **build** (parallel)
- **test**
- **lint**

#### Migration

This section is responsible for scripts that will help to adapt the basic state of the package to the desired one.

- **detach**. Detach your package from the workspace. Just in case you plan to use the package as a submodule to run it independently outside the host workspace.

<br/>

### Contributing

Check out [contributing guideline](https://github.com/untaggable/monoreact/blob/master/CONTRIBUTING.md) to familiarize yourself with the general rules of the project, as well as to figure out how to bootstrap the project and make changes correctly.

<br/>

### License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.<br/>
