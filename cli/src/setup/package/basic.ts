import {
  BASE_PACKAGE_SCRIPTS,
  WORKSPACE_PACKAGE_JSON
} from '../../helpers/constants';

export const basicTemplate: CLI.Template.PackageOptions = {
  dependencies: [],
  packageJson: {
    ...WORKSPACE_PACKAGE_JSON,
    scripts: BASE_PACKAGE_SCRIPTS
  }
};
