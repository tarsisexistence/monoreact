import { color } from '../utils';

export const newMessage = {
  changeFolder: () => "Yes, let's choose another project name",
  leaveCurrentFolder: () =>
    'No, I want to create a project in this folder (without overwriting)',

  initial: (name: string) => name,
  existsPrompt: (dir: string) =>
    `The folder at ${color.error(dir)} already exists! ${color.bold(
      'Choose a different name'
    )}`,

  failedPreparation: () => color.error('A preparation error has occurred'),
  preparing: () =>
    `${color.info(
      'Preparation in progress'
    )}: file processing, dependency installation`,
  prepared: () => color.success('Preparation completed successfully'),

  creating: (dir: string) => `Creating React project at ${color.info(dir)}`,
  failed: (name: string) => `Failed to create ${color.error(name)} project`,
  created: ({ name, dir }: { name: string; dir: string }) =>
    `${color.success('Success!')} Created new ${color.info(
      name
    )} project at ${color.info(dir)}`,

  finish: (dir: string) => `
  ${color.success('Awesome!')} You're now ready to start coding
  
  You might begin with:
  ${color.info('cd')} ${color.bold(dir)}
  ${color.info('yarn start')}
  
  ${color.info('yarn start')}
    Starts the development server
  
  ${color.info('yarn build')}
    Bundles the app into static files for production
    
  ${color.info('yarn test')}
    Starts the test runner
    
  ${color.info('yarn eject')}
    Removes this tool and copies build dependencies, configuration files and scripts into the app directory
    
  ${color.info('yarn lint')} / ${color.info('yarn stylelint')}
    Runs lint runners
    
  ${color.highlight('Happy coding :)')}
  `
} as const;
