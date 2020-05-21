import { info, success } from '../utils';

export const submodulesMessage = {
  init: () => info('Initializing missing submodules'),

  entering: (repo: string) => info(`Entering '${repo}'`),

  finished: ({
    cmd,
    type,
    code
  }: {
    cmd: CLI.Submodules.Command;
    type: 'host' | 'submodules';
    code: number;
  }) => success(`Finished ${cmd} '${type}' with code ${code}`)
};
