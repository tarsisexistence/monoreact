module.exports = {
  transform: { '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest' },
  testMatch: ['<rootDir>/src/*.test.ts'],
  roots: ['<rootDir>/test/'],
  rootDir: __dirname
};
