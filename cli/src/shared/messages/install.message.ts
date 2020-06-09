import { error, info } from '../utils';

export const installMessage = {
  successful: (dependencies: string) =>
    `Successfully installed [${info(dependencies)}] dependencies`,

  installing: (dependencies: string) =>
    `Installing [${info(dependencies)}] dependencies...`,

  failed: (dependencies: string) =>
    `Failed to install [${error(dependencies)}] dependencies`
};
