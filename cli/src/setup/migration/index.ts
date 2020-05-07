import { independencySetup } from './independency.setup';

export const migrationSetup: Record<
  CLI.Setup.MigrationType,
  CLI.Setup.MigrationOptions
> = {
  independency: independencySetup
};
