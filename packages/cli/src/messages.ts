import chalk from 'chalk';
import getInstallCmd from './getInstallCmd';
import * as Output from './output';

export const installing = function(packages: string[]) {
  const pkgText = packages
    .map(function(pkg) {
      return `    ${chalk.cyan(chalk.bold(pkg))}`;
    })
    .join('\n');

  return `Installing npm modules:
${pkgText}
`;
};

export const start = async function(projectName: string) {
  const cmd = await getInstallCmd();

  const commands = {
    install: cmd === 'npm' ? 'npm install' : 'yarn install',
    build: cmd === 'npm' ? 'npm run build' : 'yarn build',
    start: cmd === 'npm' ? 'npm run start' : 'yarn start',
    test: cmd === 'npm' ? 'npm test' : 'yarn test'
  };

  return `
  ${chalk.green('Awesome!')} You're now ready to start coding.
  
  I already ran ${Output.cmd(commands.install)} for you, so your next steps are:
    ${Output.cmd(`cd ${projectName}`)}  
`;
};
