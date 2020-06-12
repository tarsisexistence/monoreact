## The project is under active development. The documentation updated iteratively.

### What problems does it solve

- [microfrontend](https://martinfowler.com/articles/micro-frontends.html)
- [monolithic repository, monorepo](https://www.perforce.com/blog/vcs/what-monorepo)
- [workspaces](https://www.smashingmagazine.com/2019/07/yarn-workspaces-organize-project-codebase-pro/)
- [submodules](https://chrisjean.com/git-submodules-adding-using-removing-and-updating/)

<br/>

### What is it

This is an advanced workspace implementation for react applications. 

**Re-space** includes the following features:

- develop regular react apps
- scaffold React projects
- build JavaScript, TypeScript, React libraries
- implement monorepo, workspaces, submodules
- workspace, submodules management
- efficient bundling (rollup)
- workspace dependency awareness (connectivity)

<br/>

### Why is this an advanced implementation

It uses CLI, which does what you exactly need to build react applications.

<br/>

### Motivation

The primary motivation was not to be tied to existing solutions of vendors, so as not to get into vendor lock.

Nevertheless, I recommend considering alternative solutions:

- [nx/react](https://nx.dev/react) - a super powerful tool that can do everything, but turned out to be redundant for me.
- [lerna](https://github.com/lerna/lerna) - completely threw this idea away with existing yarn workspaces, yarn, and git submodules scripts.
- [tsdx](https://github.com/jaredpalmer/tsdx) - an interesting idea, where I had to learn a lot; however, it also does and does not do what my project precisely needed.

<br/>

### What can it do now

Even in its raw form, it is already ready for use, and here is what exactly you can do with **re-space**:

- scaffold project and build React applications with [create-react-app](https://create-react-app.dev/)
- bundle your packages with [rollup](https://rollupjs.org/guide/en/)
- use advanced CLI [re-space/cli](https://github.com/maktarsis/re-space/tree/master/cli)
- save your time with [typescript](https://www.typescriptlang.org/) (with the option not to use it)
- symlinking [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces)
- enjoy configured testing([jest](https://jestjs.io/)), formatting([prettier](https://prettier.io/)), linting ([eslint](https://eslint.org/) + [stylelint](https://stylelint.io/)), git hooks([husky](https://github.com/typicode/husky) + [lint-staged](https://github.com/okonet/lint-staged)))

<br/>

### Powerful CLI

This CLI has the built-in documentation. Type in the console `re-space --help` to see all possible scripts and their description.

The following options are now available:

#### Scaffolding

- **new**. Creates a host/shell application. This is the initial scaffolding of the entire application.
- **generate** a new package (submodule): basic, react. Re-space creates a distribution of responsibility. Not all packages must deal with react components. Sometimes you want to build plain JavaScript/TypeScript libraries.
- **add** a new feature (available options: docz, playground(run packages locally inside the package workspace)). Re-space allows you to not generate components with all the things that may not necessarily need in each package.

#### Execution

- **build** and **serve** your package with a modern rollup module bundler. Rollup is the best choice for building independent libraries due to efficient tree-shaking and fast compilation.
- **test** and **lint** your package with Jest and eslint. These built-in packages are crucial for increasing and maintaining the quality of built libraries.
- **install** dependencies. This option provides workspace dependency management. If you are running **install** inside some package, it'll add these dependencies as "peer" and add them to the root.

#### Submodules

It is quite challenging for managing git submodules. You have to perform many actions to make a simple task happen, and this is what scares people off from using submodules. In turn, Re-space offers user-friendly control through commands, which increases understanding and speed of interaction with git submodules.

- **checkout**
- **fetch**
- **init**
- **pull**

#### Workspaces

Re-space offers a much efficient alternative to the "yarn workspaces". It analyzes your dependencies between workspaces and runs them in the desired sequence and in parallel, when necessary and appropriate.

- **serve** (parallel)
- **build** (parallel)
- **test**
- **lint**

#### Migration

This section is responsible for scripts that will help to adapt the basic state of the package to the desired one.

- **independency**. Just in case you plan to use the package as a submodule and want it to run independently outside the host workspace

<br/>

### Bootstrap example-app

> Project uses git submodules
> If you are not familiar with git submodules, please follow the instructions to bootstrap the project

1. git clone --recursive https://github.com/maktarsis/re-space.git
2. npx yarn install (**you can omit "npx" if you have installed yarn globally**)
3. cd example-app
4. yarn workspaces run build
5. yarn start

<br/>

### Bootstrap CLI

1. git clone --recursive https://github.com/maktarsis/re-space.git
2. npx yarn install (**you can omit "npx" if you have installed yarn globally**)
3. cd cli
4. yarn start

<br/>

### Contributing

Contributions are welcome. For significant changes, please open an issue first to discuss what you would like to change.

If you made a PR, make sure to update tests as appropriate and keep the examples consistent.

<br/>

### License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.<br/>
