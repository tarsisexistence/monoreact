import { PackageTemplate } from './template';
import {
  BASE_PACKAGE_JSON,
  COMPONENT_PACKAGE_SCRIPTS,
  REACT_TEMPLATE_DEPENDENCIES
} from './shared';

export const reactTypescriptTemplate: PackageTemplate = {
  dependencies: [
    ...Object.keys(REACT_TEMPLATE_DEPENDENCIES.peerDependencies),
    'typescript'
  ],
  packageJson: {
    ...BASE_PACKAGE_JSON,
    ...REACT_TEMPLATE_DEPENDENCIES,
    scripts: COMPONENT_PACKAGE_SCRIPTS,
    input: 'src/publicApi.ts'
  }
};
