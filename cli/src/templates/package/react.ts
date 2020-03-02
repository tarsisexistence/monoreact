import {
  WORKSPACE_PACKAGE_JSON,
  COMPONENT_PACKAGE_SCRIPTS,
  REACT_TEMPLATE_DEPENDENCIES
} from '../shared';

export const reactTemplate: CLI.Template.PackageOptions = {
  dependencies: [
    ...Object.keys(REACT_TEMPLATE_DEPENDENCIES.peerDependencies),
    'typescript'
  ],
  packageJson: {
    ...WORKSPACE_PACKAGE_JSON,
    ...REACT_TEMPLATE_DEPENDENCIES,
    scripts: COMPONENT_PACKAGE_SCRIPTS
  }
};
