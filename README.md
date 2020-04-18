## Full documentation will be available soon

<br/>

### This is an advanced workspace implementation for react applications

**Re-space** includes the following features:

- write normal react apps
- create js/ts/react libraries
- implement monorepo / submodules

<br/>

### Why is this an advanced implementation

It uses CLI, which does exactly what you need to write react applications.
Currently, the solution is fully customizable.
Future design implementation will be revised.

<br/>

### Motivation

The main motivation was not to be tied to existing solutions of vendors, so as not to get into vendor lock.

Nevertheless, I recommend considering alternative solutions:

- [nx/react](https://nx.dev/react) - super powerful tool that can do everything, but turned out to be redundant for me.
- [lerna](https://github.com/lerna/lerna) - completely threw this idea away with existing yarn workspaces, yarn and git submodules scripts.
- [tsdx](https://github.com/jaredpalmer/tsdx) - an interesting idea, where I had to learn a lot, however, it also does and does not do exactly what my project needed.

I will explain in more detail later why these solutions did not fit perfectly into the business problems I encountered

<br/>

### The solution is currently raw

In fact, the base implementation is ready for use.

Nevertheless, I would also like to finish some important changes in the **re-space/cli** that will help show off the full power of this implementation.

Namely, it is necessary to complete the CLI, which will generate a completely basic boilerplate of the main application (repository / module),
which will be the workspace root of the whole project.

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

- build and serve your package with rollup. Rollup is the best choice for building independent libraries due to efficient tree-shaking and fast compilation.
- test and lint your package with Jest and eslint. These built-in commands will help to increase and maintain the quality of built libraries.
- generate a new package (submodule): basic, react. This creates a distribution of responsibility. Not all packages must deal with react components. Sometimes you wanna build plain JavaScript/TypeScript libraries.
- add a new feature (feature): docz, playground(run packages locally). Allows you to not generate components with all the things that may not necessarily be needed in each package.
- install dependencies. This option provides workspace dependency management. If you run install inside some package, it'll add this dependency as peer and will add dependencies to the root to the appropriate dependency section.
- manage submodules. It is quite difficult to manage git submodules. You have to perform many actions just to make a simple task happen and this is what scares people off from using submodules. In turn, re-space offers user-friendly control through commands, which will increase understanding and speed of interaction with submodules.

It is planned to add the following options in the near future:

- generate a new main application.
- increase the number of plug-ins features

<br/>

### License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.

<br/>

### Contributing

Contributions are welcome. For major changes, please open an issue first to discuss what you would like to change.

If you made a PR, make sure to update tests as appropriate and keep the examples consistent.

<br/>
