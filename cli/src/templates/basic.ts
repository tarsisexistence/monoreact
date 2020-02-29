import { PackageTemplate } from './template';
import { BASE_PACKAGE_SCRIPTS, BASE_PACKAGE_JSON } from './shared';

export const basicTemplate: PackageTemplate = {
  dependencies: [],
  packageJson: {
    ...BASE_PACKAGE_JSON,
    scripts: BASE_PACKAGE_SCRIPTS,
    input: 'src/publicApi.js'
  }
};
