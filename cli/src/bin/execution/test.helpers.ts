import path from 'path';
import fs from 'fs-extra';

export const getJestConfigOptions = async (
  packagePath: string,
  config: string | undefined
) => {
  try {
    if (config) {
      const jestConfigPathOption = path.resolve(packagePath, config);
      // const isSpecifiedConfigExists = fs.existsSync(jestConfigPathOption);
      for (let i = 0; i < process.argv.length; i += 1) {
        if (process.argv[i] === '--config') {
          process.argv = process.argv
            .slice(0, i)
            .concat(process.argv.slice(i + 2));
          break;
        }
      }
      const filenameSegments = config.split('.');
      const isJavaScript =
        filenameSegments[filenameSegments.length - 1] === 'JS';
      return isJavaScript
        ? // eslint-disable-next-line global-require,import/no-dynamic-require
          require(jestConfigPathOption)
        : await fs.readJSON(jestConfigPathOption);
    }

    const jestConfigPathJS = path.resolve(packagePath, `jest.config.js`);
    const jestConfigPathJSON = path.resolve(packagePath, `jest.config.json`);
    if (fs.existsSync(jestConfigPathJS)) {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      return require(jestConfigPathJS);
    } else if (fs.existsSync(jestConfigPathJSON)) {
      return await fs.readJSON(jestConfigPathJSON);
    }
  } catch {}

  return {};
};

export const setTestNodeVariables = (): void => {
  process.env.NODE_ENV = 'test';
  process.env.BABEL_ENV = 'test';
};
