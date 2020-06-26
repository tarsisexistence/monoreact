import {
  REACT_PACKAGE_SCRIPTS,
  REACT_TEMPLATE_DEPENDENCIES,
  WORKSPACE_PACKAGE_JSON
} from '../../../../shared/constants/package.const';

export const reactSetup: CLI.Setup.GenerateOptions = {
  dependencies: Object.keys(REACT_TEMPLATE_DEPENDENCIES.peerDependencies as Record<string, string>),
  packageJson: {
    ...WORKSPACE_PACKAGE_JSON,
    ...REACT_TEMPLATE_DEPENDENCIES,
    scripts: REACT_PACKAGE_SCRIPTS
  }
};
