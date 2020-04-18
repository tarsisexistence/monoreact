import { CLIEngine } from 'eslint';

import { eslintRoot } from './eslintRoot.config';

export const createLintConfig = (): CLIEngine.Options['baseConfig'] => ({
  ...eslintRoot
});
