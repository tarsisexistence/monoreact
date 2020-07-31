import { cyan, blue, red, green, yellow, bold, inverse, underline } from 'colorette';

export const color = {
  info: (msg: string): string => bold(cyan(msg)),
  details: (msg: string): string => bold(blue(msg)),
  error: (msg: string): string => bold(red(msg)),
  success: (msg: string): string => bold(green(msg)),
  highlight: (msg: string): string => bold(yellow(msg)),
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
