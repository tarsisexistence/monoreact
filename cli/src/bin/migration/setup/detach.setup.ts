export const detachSetup: CLI.Setup.MigrationOptions = {
  dependencies: {
    react: '^17.0.2',
    'react-dom': '^17.0.2'
  },
  devDependencies: {
    monoreact: 'latest',
    '@typescript-eslint/parser': '^5.6.0',
    '@types/react': '^17.0.37',
    '@types/react-dom': '^17.0.11',
    'eslint-config-react-app': '^6.0.0',
    husky: '^4.3.5',
    'lint-staged': '^12.1.2',
    prettier: '^2.5.1',
    tslib: '^2.4.0',
    typescript: '^4.5.3'
  }
};
