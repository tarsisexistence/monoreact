export const independencySetup: CLI.Setup.MigrationOptions = {
  dependencies: {
    react: '^16.13.1',
    'react-dom': '^16.13.1'
  },
  devDependencies: {
    '@re-space/cli': 'latest',
    '@typescript-eslint/parser': '^2.31.0',
    '@types/react': '^16.9.34',
    '@types/react-dom': '^16.9.7',
    'eslint-config-react-app': '^5.2.1',
    husky: '^4.2.5',
    'lint-staged': '10.2.0',
    prettier: '2.0.5',
    tslib: '^1.11.2',
    typescript: '^3.8.3'
  }
};
