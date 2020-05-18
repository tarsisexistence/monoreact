import fs from 'fs-extra';
import path from 'path';

import { PACKAGE_JSON, TSCONFIG_JSON } from '../constants/package.const';
import { TsconfigJSON } from '../../typings/tsconfig';

export const readTsconfigJson = (dir: string): Promise<TsconfigJSON> =>
  fs.readJSON(path.resolve(dir, TSCONFIG_JSON));

export const readPackageJson = <T = CLI.Package.BasePackageJSON>(
  dir: string
): Promise<T> => fs.readJSON(path.resolve(dir, PACKAGE_JSON));
