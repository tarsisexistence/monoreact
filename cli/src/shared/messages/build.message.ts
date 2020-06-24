import { highlight, info, success } from '../utils';

export const buildMessage = {
  bundling: ({ source, module }: { source: string; module: string }) =>
    info(`${source} → ${module}`),

  successful: ([s, ms]: [number, number]) =>
    success('Compiled in ') + highlight(`${s}.${ms.toString().slice(0, 3)}s.`)
} as const;
