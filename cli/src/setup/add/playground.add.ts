export const playgroundTemplate: CLI.Template.AddOptions = {
  path: './playground',
  scripts: {
    'start:playground':
      'yarn build & concurrently --kill-others "yarn start" "cd playground & yarn start"'
  }
};
