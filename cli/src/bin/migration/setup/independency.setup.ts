export const independencySetup: CLI.Setup.MigrationOptions = {
  dependencies: {
    react: '^17.0.1',
    'react-dom': '^17.0.1'
  },
  devDependencies: {
    monoreact: 'latest',
    '@typescript-eslint/parser': '^4.24.0',
    '@types/react': '^17.0.6',
    '@types/react-dom': '^17.0.5',
    'eslint-config-react-app': '^6.0.0',
    husky: '^6.0.0',
    'lint-staged': '11.0.0',
    prettier: '2.3.0',
    tslib: '^2.2.0',
    typescript: '^4.2.4'
  },
  hooks: {
    'pre-commit': 'lint-staged && yarn lint'
  }
};
