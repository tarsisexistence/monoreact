import chalk from 'chalk';

export const bold = (msg: string): string => chalk.bold(msg);
export const info = (msg: string): string => chalk.bold.cyan(msg);
export const error = (msg: string): string => chalk.bold.red(msg);
export const success = (msg: string): string => chalk.bold.green(msg);
export const highlight = (msg: string): string => chalk.bold.yellow(msg);
export const inverse = (msg: string): string => chalk.inverse(`${msg}`);
export const underline = (msg: string): string => chalk.underline(msg);
