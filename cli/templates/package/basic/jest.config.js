const path = require('path');
const jestPackageConfig = require('../../settings/jest.config');

module.exports = {
  ...jestPackageConfig,
  roots: [path.resolve(__dirname, 'src')],
  setupFiles: [path.resolve(__dirname, '../../settings/setupTests.ts')],
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: [
    path.resolve(__dirname, 'node_modules/'),
    path.resolve(__dirname, '../../node_modules/')
  ]
};
