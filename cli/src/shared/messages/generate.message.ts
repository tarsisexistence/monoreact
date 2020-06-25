import { color } from '../utils';

export const generateMessage = {
  copy: (name: string) => `${name}-copy`,

  successful: (name: string) => `Generated ${color.info(name)} package`,

  generating: (name: string) => `Generating ${color.info(name)} package...`,

  failed: (name: string) => `Failed to generate ${color.error(name)} package`,

  successfulConfigure: () => 'The package successfully configured',

  failedConfigure: () => `Failed to fully configure the package`,

  invalidTemplate: (template: string) => `Invalid template ${color.error(template)}`,

  exists: (name: string) =>
    `A folder named ${color.error(name)} already exists! ${color.bold('Choose a different name')}`,

  preparingPackage: (name: string, dependencies: string[]) => {
    const pkgText = dependencies.map(pkg => `     ${color.info(pkg)}`).join('\n');
    const requiredText = `Preparing ${color.info(name)} package`;
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
  ${color.success('Awesome!')} You're now ready to start coding.
  
  There is no need to run ${color.info(commands.install)}, since all peer dependencies are already in the workspace root
  
  So your next steps are:
    ${color.info(`cd packages/${projectName}`)}
  
  To start developing (rebuilds the bundle on changes):
    ${color.info(commands.start)}
  
  To build the bundle:
    ${color.info(commands.build)}
    
  To test the package:
    ${color.info(commands.test)}
    
  ${color.highlight('Happy coding :)')}
  `;
  }
} as const;
