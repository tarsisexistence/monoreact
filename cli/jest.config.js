module.exports = {
  transform: { '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest' },
  testMatch: ['<rootDir>/**/*(*.)@(test).[tj]s?(x)'],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/templates/',
    '<rootDir>/test/.staging/*',
    '<rootDir>/test/.*/fixtures/'
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'jsx', 'tsx', 'node']
};
