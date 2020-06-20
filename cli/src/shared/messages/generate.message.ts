import { bold, error, highlight, info, success } from '../utils';

export const generateMessage: CLI.Common.Messages = {
  copy: (name: string) => `${name}-copy`,

  successful: (name: string) => `Generated ${info(name)} package`,

  generating: (name: string) => `Generating ${info(name)} package...`,

  failed: (name: string) => `Failed to generate ${error(name)} package`,

  successfulConfigure: () => 'The package successfully configured',

  failedConfigure: () => `Failed to fully configure the package`,

  invalidTemplate: (template: string) => `Invalid template ${error(template)}`,

  exists: (name: string) =>
    `A folder named ${error(name)} already exists! ${bold(
      'Choose a different name'
    )}`,

  preparingPackage: (name: string, dependencies: string[]) => {
    const pkgText = dependencies.map(pkg => `     ${info(pkg)}`).join('\n');
    const requiredText = `Preparing ${info(name)} package`;
    return dependencies.length > 0
      ? `${requiredText} with the following peer dependencies: 
${pkgText}
`
      : requiredText;
  },

  preparedPackage: (projectName: string) => {
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
    
  ${highlight('Happy coding :)')}
  `;
  }
};
