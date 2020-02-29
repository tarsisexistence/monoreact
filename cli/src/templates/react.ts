import { PackageTemplate } from './template';

import {
  COMPONENT_PACKAGE_SCRIPTS,
  BASE_PACKAGE_JSON,
  REACT_TEMPLATE_DEPENDENCIES
} from './shared';

export const reactTemplate: PackageTemplate = {
  dependencies: Object.keys(REACT_TEMPLATE_DEPENDENCIES.peerDependencies),
  packageJson: {
    ...BASE_PACKAGE_JSON,
    ...REACT_TEMPLATE_DEPENDENCIES,
    scripts: COMPONENT_PACKAGE_SCRIPTS,
    input: 'src/publicApi.js'
  }
};

export default reactTemplate;
