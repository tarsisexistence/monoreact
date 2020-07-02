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
