export const playgroundSetup: CLI.Setup.AddOptions = {
  path: './playground',
  scripts: {
    'start:playground':
      'yarn build & concurrently --kill-others "yarn start" "cd playground & yarn start"'
  }
};
