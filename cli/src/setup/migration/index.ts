import { independencySetup } from './independency.setup';

export const migrationSetup: Record<
  CLI.Template.MigrationType,
  CLI.Template.MigrationOptions
> = {
  independency: independencySetup
};
