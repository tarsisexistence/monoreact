import path from 'path';
import { CLIEngine } from 'eslint';

export const createLintConfig = (dir: string): CLIEngine.Options['baseConfig'] => {
  const settings: Record<string, any> = {
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

  const rules = {
    'import/no-unresolved': 0
  };

  return {
    settings,
    ignorePatterns,
    extends: extendsConfig,
    rules
  };
};
