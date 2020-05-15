import { bold, error, highlight, info, success } from '../utils';

export const generateMessage = {
  copy: (packageName: string) => `${packageName}-copy`,

  successful: (packageName: string) => `Generated ${info(packageName)} package`,

  generating: (packageName: string) =>
    `Generating ${info(packageName)} package...`,

  failed: (packageName: string) =>
    `Failed to generate ${error(packageName)} package`,

  successfulConfigure: () => 'The package successfully configured',

  failedConfigure: () => `Failed to fully configure the package`,

  invalidTemplate: (template: string) => `Invalid template ${error(template)}`,

  exists: (packageName: string) =>
    `A folder named ${error(packageName)} already exists! ${bold(
      'Choose a different name'
    )}`,

  preparingPackage: (packageName: string, dependencies: string[]) => {
    const pkgText = dependencies.map(pkg => `     ${info(pkg)}`).join('\n');
    const requiredText = `Preparing ${info(packageName)} package`;
    return dependencies.length > 0
      ? `${requiredText} with the following peer dependencies: 
${pkgText}
`
      : requiredText;
  },

  preparedPackage: async (projectName: string) => {
    const commands = {
      install: 're-space install',
      start: 're-space serve',
      build: 're-space build',
      test: 're-space test'
    };

    return `
  ${success('Awesome!')} You're now ready to start coding.
  
  There is no need to run ${info(
    commands.install
  )}, since all peer dependencies are already in the workspace root
  
  So your next steps are:
    ${info(`cd packages/${projectName}`)}
  
  To start developing (rebuilds the bundle on changes):
    ${info(commands.start)}
  
  To build the bundle:
    ${info(commands.build)}
    
  To test the package:
    ${info(commands.test)}
    
  ${highlight('Happy coding :)')}`;
  }
};
