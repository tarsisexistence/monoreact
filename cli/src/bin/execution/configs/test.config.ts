import path from 'path';
import { InitialOptions } from '@jest/types/build/Config';

export const createTestConfig = ({
  rootDir,
  jestPackageOptions,
  jestConfigOptions
}: {
  rootDir: string;
  jestPackageOptions: Partial<InitialOptions>;
  jestConfigOptions: Partial<InitialOptions>;
}): Partial<InitialOptions> => ({
  rootDir,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '.(ts|tsx)$': require.resolve('ts-jest/dist'),
    '.(js|jsx)$': require.resolve('babel-jest')
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx,js,jsx}'],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'identity-obj-proxy',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  roots: [path.resolve(rootDir, 'src')],
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: [path.resolve(rootDir, 'node_modules/')],
  ...jestPackageOptions,
  ...jestConfigOptions
});
