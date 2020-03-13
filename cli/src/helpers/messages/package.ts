import { bold, error, highlight, info, inverse, success } from './colors';
import { PACKAGE_JSON } from '../constants';

export class PackageMessages {
  constructor(public packageName: string) {}

  script = () => inverse(` generate ${this.packageName} `);

  wrongWorkspace = () => `
    Make sure you run the script ${this.script()} from the workspace root

    The workspace root ${PACKAGE_JSON} should have:
        private: false;
        workspaces: ['packages/*']
          `;

  copy = () => `${this.packageName}-copy`;

  success = () => `Generated ${success(this.packageName)} package`;

  generating = () => `Generating ${info(this.packageName)} package...`;

  failed = () => `Failed to generate ${error(this.packageName)} package`;

  successfulConfigure = () => 'The package successfully configured';

  failedConfigure = () => `Failed to fully configure the package`;

  invalidTemplate = (template: string) => `Invalid template ${error(template)}`;

  exists = () =>
    `A folder named ${error(this.packageName)} already exists! ${bold(
      'Choose a different name'
    )}`;

  preparingPackage = (packages: string[]) => {
    const pkgText = packages.map(pkg => `     ${info(pkg)}`).join('\n');

    return packages.length > 0
      ? `Preparing a package with the following peer dependencies: 
${pkgText}
`
      : 'Preparing the package...';
  };

  preparedPackage = async (projectName: string) => {
    const commands = {
      install: 'yarn install',
      start: 'yarn start',
      build: 'yarn build',
      test: 'yarn test'
    };

    return `
  ${success('Awesome!')} You're now ready to start coding.
  
  There is no need to run ${info(
    commands.install
  )}, since all peer dependencies are already in the workspace root
  
  So your next steps are:
    ${info(`cd ${projectName}`)}
  
  To start developing (rebuilds the bundle on changes):
    ${info(commands.start)}
  
  To build the bundle:
    ${info(commands.build)}
    
  To test the package:
    ${info(commands.test)}
    
  ${highlight('Happy coding :)')}`;
  };
}
