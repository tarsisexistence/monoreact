import { independencySetup } from './independency.setup';

export const migrationSetup: Record<CLI.Setup.MigrationOptionType, CLI.Setup.MigrationOptions> = {
  independency: independencySetup
};
