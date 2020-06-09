import { craSetup } from './cra.setup';

export const newSetup: Record<CLI.Setup.NewOptionType, CLI.Setup.NewOptions> = {
  cra: craSetup
};
