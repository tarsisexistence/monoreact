import { basicSetup } from './basic.setup';
import { reactSetup } from './react.setup';

export const generateSetup: Record<
  CLI.Setup.GenerateType,
  CLI.Setup.GenerateOptions
> = {
  basic: basicSetup,
  react: reactSetup
};
