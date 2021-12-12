import path from 'path';
import { ESLint } from 'eslint';

export const createLintConfig = (dir: string, project: string[]): ESLint.Options['baseConfig'] => {
  const settings: { [name: string]: any } = {
    'import/resolver': {
      node: {
        paths: [path.resolve(dir, 'src')],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    react: {
      version: 'detect'
    }
  };

  const ignorePatterns = ['*.*ss'];

  const extendsConfig = [
    'eslint:recommended',
    'react-app',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended'
  ];

  const rules: { [name: string]: any } = {
    'import/no-unresolved': 0
  };

  return {
    ignorePatterns,
    settings,
    rules,
    extends: extendsConfig,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      tsconfigRootDir: dir,
      project
    },
  };
};
