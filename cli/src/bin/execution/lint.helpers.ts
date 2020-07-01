import path from 'path';

import { findPackageDirectory, findHostDirectory } from '../../shared/utils';
import { TSCONFIG_JSON } from '../../shared/constants/package.const';

export const getPackageLintInfo = async (): Promise<{
  dir: string;
  project: string[];
}> => {
  const project = [];
  let dir = '';

  try {
    dir = await findPackageDirectory(true);
    project.push(path.resolve(dir, TSCONFIG_JSON));
    /* eslint-disable-next-line no-empty */
  } catch {}

  try {
    const hasPackageDir = dir !== '';
    const rootDir = await findHostDirectory(hasPackageDir);

    if (!hasPackageDir) {
      dir = rootDir;
    }

    project.push(path.resolve(rootDir, TSCONFIG_JSON));
    /* eslint-disable-next-line no-empty */
  } catch {}

  return {
    dir,
    project
  };
};
