import path from 'path';
import { CLIEngine } from 'eslint';

export async function createLintConfig({
  rootDir
}: {
  rootDir: string;
}): Promise<CLIEngine.Options['baseConfig'] | void> {
  return {
    // TODO: fix
    // extends: path.resolve(rootDir, '../../.eslintrc.js'),
    parserOptions: {
      tsconfigRootDir: rootDir,
      project: [
        path.resolve(__dirname, './tsconfig.lint.json'),
        path.resolve(rootDir, 'tsconfig.json')
      ]
    },
    settings: {
      'import/resolver': {
        node: {
          paths: [path.resolve(__dirname, 'src')],
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      }
    }
  };
}
