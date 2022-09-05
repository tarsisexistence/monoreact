import { pipe } from 'ramda';
import { cyan, blue, red, green, yellow, bold, inverse, underline } from 'picocolors';

export const color = {
  info: (msg: string): string => pipe(bold, cyan)(msg),
  details: (msg: string): string => pipe(bold, blue)(msg),
  error: (msg: string): string => pipe(bold, red)(msg),
  success: (msg: string): string => pipe(bold, green)(msg),
  highlight: (msg: string): string => pipe(bold, yellow)(msg),
  bold: (msg: string): string => bold(msg),
  inverse: (msg: string): string => inverse(msg),
  underline: (msg: string): string => underline(msg)
} as const;

// Taken from Create React App, react-dev-utils/clearConsole
// @see https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/clearConsole.js
export function clearConsole(): void {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}

export const space = (): boolean => process.stdout.write('\n');
