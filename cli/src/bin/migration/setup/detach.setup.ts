export const detachSetup: CLI.Setup.MigrationOptions = {
  dependencies: {
    react: '^18.2.0',
    'react-dom': '^18.2.0'
  },
  devDependencies: {
    monoreact: 'latest',
    '@typescript-eslint/parser': '^5.6.0',
    '@types/react': '^18.0.18',
    '@types/react-dom': '^18.0.6',
    'eslint-config-react-app': '^6.0.0',
    husky: '^4.3.8',
    'lint-staged': '^12.1.2',
    prettier: '^2.5.1',
    tslib: '^2.4.0',
    typescript: '^4.5.3'
  }
};
