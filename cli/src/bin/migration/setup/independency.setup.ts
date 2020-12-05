export const independencySetup: CLI.Setup.MigrationOptions = {
  dependencies: {
    react: '^16.13.1',
    'react-dom': '^16.13.1'
  },
  devDependencies: {
    monoreact: 'latest',
    '@typescript-eslint/parser': '^4.9.0',
    '@types/react': '^16.14.2',
    '@types/react-dom': '^16.9.10',
    'eslint-config-react-app': '^6.0.0',
    husky: '^4.3.0',
    'lint-staged': '10.5.3',
    prettier: '2.2.1',
    tslib: '^2.0.3',
    typescript: '^4.1.2'
  }
};
