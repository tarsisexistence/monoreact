import {
  BASE_PACKAGE_SCRIPTS,
  WORKSPACE_PACKAGE_JSON
} from '../../shared/constants/package.const';

export const basicSetup: CLI.Setup.GenerateOptions = {
  dependencies: [],
  packageJson: {
    ...WORKSPACE_PACKAGE_JSON,
    scripts: BASE_PACKAGE_SCRIPTS
  }
};
