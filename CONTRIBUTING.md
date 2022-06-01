# Contributing

<br/>

Contributions are welcome. For significant changes, please open an issue first to discuss what you would like to change.

<br/>

## Setup project

> Project uses git submodules
>
> If you are not familiar with git submodules, please follow the instructions to bootstrap the project
>
> That's why you need --recursive flag with git clone.
>
> Otherwise, if you already cloned the project without --recursive, type "git submodule update --remote --init"

1. git clone --recursive https://github.com/tarsinzer/monoreact.git
2. yarn

<br/>

## Testing

```shell
yarn test
```

<br/>

## Building

```shell
yarn build
```

or if you want to have a watcher

```shell
yarn start
```

<br/>

## Submitting Pull Requests

**Please follow these basic steps to simplify pull request reviews. If you don't you'll probably just be asked to anyway.**

- Please rebase your branch against the current master.
- Run the `Setup` command to make sure your development dependencies are up-to-date.
- Please ensure the test suite passes before submitting a PR.
- If you've added new functionality, **please** include tests which validate its behavior.
- Make reference to possible [issues](https://github.com/tarsinzer/monoreact/issues) on PR comment.

<br/>

## Submitting bug reports

- Search through issues to see if a previous issue has already been reported and/or fixed.
- Provide a _small_ reproduction.
- Please detail the affected browser(s) and operating system(s).
- Please be sure to state which version of monoreact, node and npm you're using.

<br/>

## Submitting new features

- Submit an issue with the prefix `RFC:` with your feature request.
- The feature will be discussed and considered.
- Once the PR is submitted, it will be reviewed and merged once approved.

<br/>

### Commit Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests

> Example:
>
> build: add closure compiler option <br/>
> test: new X script <br/>
> fix: failing build function

<br/>
