import { color } from '../utils';

export const buildMessage = {
  bundling: ({ source, module }: { source: string; module: string }) =>
    color.info(`${source} → ${module}`),

  successful: ([s, ms]: [number, number]) =>
    color.success('Compiled in ') +
    color.highlight(`${s}.${ms.toString().slice(0, 3)}s.`)
} as const;
