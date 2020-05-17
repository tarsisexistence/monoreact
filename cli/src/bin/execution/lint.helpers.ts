import path from 'path';

import {
  findWorkspacePackageDir,
  findWorkspaceRootDir
} from '../../shared/utils';
import { TSCONFIG_JSON } from '../../shared/constants/package.const';

export const getPackageLintInfo = async (): Promise<{
  isRoot: boolean;
  dir: string;
  project: string[];
}> => {
  const project = [];
  let dir = '';
  let isRoot = false;

  try {
    dir = await findWorkspacePackageDir(true);
    project.push(path.resolve(dir, TSCONFIG_JSON));
  } catch {}

  try {
    const hasPackageDir = dir !== '';
    const rootDir = await findWorkspaceRootDir(hasPackageDir);
    isRoot = true;

    if (!hasPackageDir) {
      dir = rootDir;
    }

    project.push(path.resolve(rootDir, TSCONFIG_JSON));
  } catch {}

  return {
    isRoot,
    dir,
    project
  };
};
