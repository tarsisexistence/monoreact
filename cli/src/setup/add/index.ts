import { doczSetup } from './docz.setup';
import { playgroundSetup } from './playground.setup';

export const featureSetup: Record<CLI.Setup.AddType, CLI.Setup.AddOptions> = {
  docz: doczSetup,
  playground: playgroundSetup
};
