import { highlight, info } from '../utils';

export const lintMessage = {
  linting: (files: string[]) => info(`Linting ${files} ...`),

  linted: ([s, ms]: [number, number]) =>
    info('Linted in ') + highlight(`${s}.${ms.toString().slice(0, 3)}s.`)
};
