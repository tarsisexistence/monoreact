import chalk from 'chalk';
import { error as errMsg } from '../helpers/messages/colors';

const stderr = console.error.bind(console);

export function logError(err: any) {
  const error = err.error || err;
  const description = `${error.name ? error.name + ': ' : ''}${error.message ||
    error}`;
  const message = error.plugin
    ? error.plugin === 'rpt2'
      ? `(typescript) ${description}`
      : `(${error.plugin} plugin) ${description}`
    : description;

  stderr(errMsg(`    ${message}`));

  if (error.loc) {
    stderr();
    stderr(`at ${error.loc.file}:${error.loc.line}:${error.loc.column}`);
  }

  if (error.frame) {
    stderr();
    stderr(chalk.dim(error.frame));
  } else if (err.stack) {
    const headlessStack = error.stack.replace(message, '');
    stderr(chalk.dim(headlessStack));
  }
}
