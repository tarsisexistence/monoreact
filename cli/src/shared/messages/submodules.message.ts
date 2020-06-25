import { color } from '../utils';

export const submodulesMessage = {
  init: () => color.info('Initializing missing submodules'),

  entering: (repo: string) => color.info(`Entering '${repo}'`),

  finished: ({
    cmd,
    type,
    code
  }: {
    cmd: CLI.Submodules.Command;
    type: 'host' | 'submodules';
    code: number;
  }) => color.success(`Finished ${cmd} '${type}' with code ${code}`)
} as const;
