import { color } from '../utils';

export const installMessage = {
  successful: (dependencies: string) => `Successfully installed [${color.info(dependencies)}] dependencies`,

  installing: (dependencies: string) => `Installing [${color.info(dependencies)}] dependencies...`,

  failed: (dependencies: string) => `Failed to install [${color.error(dependencies)}] dependencies`
} as const;
