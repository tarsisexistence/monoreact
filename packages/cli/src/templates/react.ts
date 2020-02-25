import { Template } from './template';

import basicTemplate from './basic';
import { PackageJson } from 'type-fest';

const reactTemplate: Template = {
  name: 'react',
  dependencies: [...basicTemplate.dependencies, 'react', 'react-dom'],
  packageJson: {
    ...basicTemplate.packageJson,
    peerDependencies: {
      react: '>=16',
      'react-dom': '>=16'
    },
    scripts: basicTemplate.packageJson.scripts as PackageJson['scripts']
  }
};

export default reactTemplate;
