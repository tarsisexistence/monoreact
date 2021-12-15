import { RollupError } from 'rollup';

import { color, space } from './console.utils';

const stderr = console.error.bind(console);

export function logError(err: RollupError): void {
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  const error = err.error || err;
  const errorName = error.name ? `${error.name} ` : '';
  const errorMessage = error.message || error;
  const description = errorName ? `${errorName} ${errorMessage}` : errorMessage;
  const message = normalizeErrorMessage(error, description);

  space();

  if (error.stack) {
    stderr(color.error(error.stack));
  } else {
    stderr(color.error(message));

    if (error.loc) {
      stderr(`at ${error.loc.file}:${error.loc.line}:${error.loc.column}`);
    }

    space();

    if (error.frame) {
      stderr(color.error(error.frame));
    }
  }

  space();
}

function normalizeErrorMessage(error: RollupError, description: string): string {
  if (!error.plugin) {
    // the interesting part here is that error.stack has empty space instead of ":" i.e "Error:"
    return description;
  }

  return error.plugin === 'rpt2' ? `(typescript) ${description}` : `(${error.plugin} plugin) ${description}`;
}
