// eslint-disable-next-line @typescript-eslint/no-var-requires
const jestPackageConfig = require('../../settings/jest.config');

// eslint-disable-next-line compat/compat
module.exports = {
  ...jestPackageConfig,
  roots: ['./src'],
  setupFiles: ['../../settings/setupTests.ts'],
  testPathIgnorePatterns: ['../../node_modules/', 'node_modules/']
};
