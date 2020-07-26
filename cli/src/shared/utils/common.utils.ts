import { exec, ShellString } from 'shelljs';

// Taken from Create React App, react-dev-utils/clearConsole
// @see https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/clearConsole.js
export function clearConsole(): void {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}

export const space = (): boolean => process.stdout.write('\n');

// TODO: find more suitable place
export const installDependencies = (): ShellString => exec('yarn install', { silent: true });

/* eslint-disable no-empty-function, @typescript-eslint/no-empty-function */
export const noop = (): void => {};

export function setNpmAuthorName(author: CLI.Package.Author): void {
  exec(`npm config set init-author-name "${author}"`, { silent: true });
}

export function getNpmAuthorName(): CLI.Package.Author | null {
  const npmNameAuthor = exec('npm config get init-author-name', {
    silent: true
  }).stdout.trim();

  if (npmNameAuthor) {
    return npmNameAuthor;
  }

  const gitNameAuthor = exec('git config user.name', { silent: true }).stdout.trim();

  if (gitNameAuthor) {
    setNpmAuthorName(gitNameAuthor);
    return gitNameAuthor;
  }

  const npmEmailAuthor = exec('npm config get init-author-email', {
    silent: true
  }).stdout.trim();

  if (npmEmailAuthor) {
    return npmEmailAuthor;
  }

  const gitEmailAuthor = exec('git config user.email', { silent: true }).stdout.trim();

  if (gitEmailAuthor) {
    return gitEmailAuthor;
  }

  return null;
}

export function deleteNpmAuthorName(author: CLI.Package.Author): void {
  exec(`npm config delete "${author}"`, { silent: true });
}
