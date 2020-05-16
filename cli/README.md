## Full documentation will be available soon

<br/>

### Quickstart

> Project uses git submodules

1. git clone --recursive https://github.com/maktarsis/re-space.git
2. npx yarn install (**you can omit "npx" if you have yarn globally**)
3. yarn workspaces run build
4. yarn start

<br/>

### This is an advanced workspace implementation for react applications

**Re-space** includes the following features:

- develop regular react apps
- create JavaScript, TypeScript, React libraries
- implement monorepo, submodules
- workspace, submodules management
- efficient rollup bundling
- workspace dependency awareness

<br/>

### Why is this an advanced implementation

It uses CLI, which does what you exactly need to write react applications.
Currently, the solution is fully customizable.
Future design implementation will be revised.

<br/>

### Motivation

The primary motivation was not to be tied to existing solutions of vendors, so as not to get into vendor lock.

Nevertheless, I recommend considering alternative solutions:

- [nx/react](https://nx.dev/react) - a super powerful tool that can do everything, but turned out to be redundant for me.
- [lerna](https://github.com/lerna/lerna) - completely threw this idea away with existing yarn workspaces, yarn, and git submodules scripts.
- [tsdx](https://github.com/jaredpalmer/tsdx) - an interesting idea, where I had to learn a lot; however, it also does and does not do what my project precisely needed.

I will explain in more detail later why these solutions did not fit perfectly into the business problems I encountered

<br/>

### The solution is currently raw

The base implementation is ready for use.

Nevertheless, I would also like to finish some essential changes in the **re-space/cli** that will help show off the full power of this implementation.

Namely, it is necessary to complete the CLI, which generates a completely basic boilerplate of the main application (repository/module),
which is the workspace root of the whole project.

<br/>

### What can it do now

Even in its raw form, it is already ready for use, and here is what exactly you can do with **re-space**:

- run your application through **create-react-app**
- bundle your packages through **rollup**
- use advanced CLI **re-space/cli**
- save your time with **typescript** (with the option not to use it)
- receive all the power of using **yarn** workspaces
- enjoy configured testing(**jest**), formatting(**prettier**), linting (**eslint**, **stylelint**), git hooks(**husky, lint-staged**) and other useful tools like copy-paste-detector(**jscpd**), dependency-bot(**renovate**)

<br/>

### Powerful CLI

The following options are now available:

- **build** and **serve** your package with a modern rollup module bundler. Rollup is the best choice for building independent libraries due to efficient tree-shaking and fast compilation.
- **test** and **lint** your package with Jest and eslint. These built-in packages are crucial for increasing and maintaining the quality of built libraries.
- **generate** a new package (submodule): basic, react. Re-space creates a distribution of responsibility. Not all packages must deal with react components. Sometimes you want to build plain JavaScript/TypeScript libraries.
- **add** a new feature (available options: docz, playground(run packages locally inside the package workspace)). Re-space allows you to not generate components with all the things that may not necessarily need in each package.
- **install** dependencies. This option provides workspace dependency management. If you are running **install** inside some package, it'll add these dependencies as "peer" and add them to the root.
- manage **submodules**. It is quite challenging for managing git submodules. You have to perform many actions to make a simple task happen, and this is what scares people off from using submodules. In turn, Re-space offers user-friendly control through commands, which increases understanding and speed of interaction with git submodules.
- manage **workspaces**. Re-space offers a much efficient alternative to the "yarn workspaces". It analyzes your dependencies between workspaces and runs them in the desired sequence and in parallel, when necessary and appropriate.

It planned to add the following options soon:

- generate a new main application.
- generate independent package (out of workspace).
- increase the number of plug-in features.

<br/>

### License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.

<br/>

### Contributing

Contributions are welcome. For significant changes, please open an issue first to discuss what you would like to change.

If you made a PR, make sure to update tests as appropriate and keep the examples consistent.

<br/>