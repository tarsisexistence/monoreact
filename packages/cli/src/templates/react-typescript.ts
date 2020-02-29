import { PackageJson } from 'type-fest';
import { PackageTemplate } from './template';
import { basicTemplate } from './basic';

export const reactTypescriptTemplate: PackageTemplate = {
  name: 'react',
  dependencies: [
    ...basicTemplate.dependencies,
    'react',
    'react-dom',
    'typescript'
  ],
  packageJson: {
    ...basicTemplate.packageJson,
    peerDependencies: {
      react: '>=16',
      'react-dom': '>=16'
    },
    scripts: basicTemplate.packageJson.scripts as PackageJson['scripts'],
    input: 'src/publicApi.ts'
  }
};
