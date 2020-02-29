import chalk from 'chalk';
import { command } from './output';

export const preparingPackage = (packages: string[]) => {
  const pkgText = packages
    .map(pkg => `     ${chalk.cyan(chalk.bold(pkg))}`)
    .join('\n');

  return packages.length > 0
    ? `Preparing a package with the following peer dependencies: 
${pkgText}
`
    : 'Preparing the package...';
};

export const preparedPackage = async (projectName: string) => {
  const commands = {
    install: 'yarn install',
    start: 'yarn start',
    build: 'yarn build',
    test: 'yarn test'
  };

  return `
  ${chalk.bold.green('Awesome!')} You're now ready to start coding.
  
  There is no need to run ${command(
    commands.install
  )} for you, since all peer dependencies are in the workspace root
  
  So your next steps are:
    ${command(`cd ${projectName}`)}
  
  To start developing (rebuilds the bundle on changes):
    ${command(commands.start)}
  
  To build the bundle:
    ${command(commands.build)}
    
  To test your package with Jest:
    ${command(commands.test)}
    
  Questions? Feedback? Please let me know!
  ${chalk.bold.green('https://github.com/maktarsis/re-space/issues')}`;
};
