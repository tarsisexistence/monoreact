import { basicSetup } from './basic.setup';
import { reactSetup } from './react.setup';

export const generateSetup: Record<
  CLI.Setup.GenerateOptionType,
  CLI.Setup.GenerateOptions
> = {
  basic: basicSetup,
  react: reactSetup
};
