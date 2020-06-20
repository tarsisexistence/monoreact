import { error, info } from '../utils';

export const installMessage: CLI.Common.Messages = {
  successful: (dependencies: string) =>
    `Successfully installed [${info(dependencies)}] dependencies`,

  installing: (dependencies: string) =>
    `Installing [${info(dependencies)}] dependencies...`,

  failed: (dependencies: string) =>
    `Failed to install [${error(dependencies)}] dependencies`
};
