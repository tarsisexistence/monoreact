export const detachSetup: CLI.Setup.MigrationOptions = {
  dependencies: {
    react: '^17.0.2',
    'react-dom': '^17.0.2'
  },
  devDependencies: {
    monoreact: 'latest',
    '@typescript-eslint/parser': '^4.28.2',
    '@types/react': '^17.0.14',
    '@types/react-dom': '^17.0.9',
    'eslint-config-react-app': '^6.0.0',
    husky: '^4.3.5',
    'lint-staged': '^12.1.2',
    prettier: '^2.5.1',
    tslib: '^2.3.1',
    typescript: '^4.3.5'
  }
};
