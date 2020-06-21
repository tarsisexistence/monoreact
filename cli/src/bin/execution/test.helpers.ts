import path from 'path';
import fs from 'fs-extra';
import { InitialOptions } from '@jest/types/build/Config';

export const getJestConfigOptions = async (
  packageDir: string,
  config: string | undefined
): Promise<InitialOptions> => {
  try {
    if (config) {
      const jestConfigPathOption = path.resolve(packageDir, config);
      process.argv.splice(process.argv.indexOf('--config'), 2);
      const filenameSegments = config.split('.');
      const isJavaScript =
        filenameSegments[filenameSegments.length - 1] === 'js';

      return isJavaScript
        ? require(jestConfigPathOption)
        : await fs.readJSON(jestConfigPathOption);
    }

    const jestConfigPathJS = path.resolve(packageDir, `jest.config.js`);
    const jestConfigPathJSON = path.resolve(packageDir, `jest.config.json`);

    if (fs.existsSync(jestConfigPathJS)) {
      return require(jestConfigPathJS);
    } else if (fs.existsSync(jestConfigPathJSON)) {
      return await fs.readJSON(jestConfigPathJSON);
    }
    /* eslint-disable-next-line no-empty */
  } catch {}

  return {} as InitialOptions;
};

export const setTestNodeVariables = (): void => {
  process.env.NODE_ENV = 'test';
  process.env.BABEL_ENV = 'test';
};
