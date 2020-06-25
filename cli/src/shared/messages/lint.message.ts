import { color } from '../utils';

export const lintMessage = {
  linting: (files: string[]) => color.info(`Linting ${files} ...`),

  linted: ([s, ms]: [number, number]) =>
    color.info('Linted in ') +
    color.highlight(`${s}.${ms.toString().slice(0, 3)}s.`)
} as const;
