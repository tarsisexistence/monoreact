import { detachSetup } from './detach.setup';

export const migrationSetup: Record<CLI.Setup.MigrationOptionType, CLI.Setup.MigrationOptions> = {
  detach: detachSetup
};
