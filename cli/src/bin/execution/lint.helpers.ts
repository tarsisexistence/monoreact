import path from 'path';

import {
  findWorkspacePackageDir,
  findWorkspaceRootDir
} from '../../shared/utils';
import { TSCONFIG_JSON } from '../../shared/constants/package.const';

export const getPackageLintInfo = async (): Promise<{
  dir: string;
  project: string[];
}> => {
  const project = [];
  let dir = '';

  try {
    dir = await findWorkspacePackageDir(true);
    project.push(path.resolve(dir, TSCONFIG_JSON));
  } catch {}

  try {
    const hasPackageDir = dir !== '';
    const rootDir = await findWorkspaceRootDir(hasPackageDir);

    if (!hasPackageDir) {
      dir = rootDir;
    }

    project.push(path.resolve(rootDir, TSCONFIG_JSON));
  } catch {}

  return {
    dir,
    project
  };
};
