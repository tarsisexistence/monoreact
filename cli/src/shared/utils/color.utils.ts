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
