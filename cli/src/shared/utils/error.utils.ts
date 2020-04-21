import chalk from 'chalk';

import { error as errMsg } from './color.utils';

const stderr = console.error.bind(console);

export function logError(err: any) {
  const error = err.error || err;
  const description = `${error.name ? `${error.name}: ` : ''}${
    error.message || error
  }`;

  let message;

  if (error.plugin) {
    message =
      error.plugin === 'rpt2'
        ? `(typescript) ${description}`
        : `(${error.plugin} plugin) ${description}`;
  } else {
    message = description;
  }

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
