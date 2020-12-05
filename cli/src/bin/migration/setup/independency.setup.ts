export const independencySetup: CLI.Setup.MigrationOptions = {
  dependencies: {
    react: '^17.0.1',
    'react-dom': '^17.0.1'
  },
  devDependencies: {
    monoreact: 'latest',
    '@typescript-eslint/parser': '^4.9.0',
    '@types/react': '^17.0.0',
    '@types/react-dom': '^17.0.0',
    'eslint-config-react-app': '^6.0.0',
    husky: '^4.3.4',
    'lint-staged': '10.5.3',
    prettier: '2.2.1',
    tslib: '^2.0.3',
    typescript: '^4.1.2'
  }
};
