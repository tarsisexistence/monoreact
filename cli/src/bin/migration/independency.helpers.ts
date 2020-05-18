import fs from 'fs-extra';
import path from 'path';

import { migrationSetup } from './setup';
import {
  PACKAGE_JSON,
  TSCONFIG_JSON
} from '../../shared/constants/package.const';
import { readPackageJson, readTsconfigJson } from '../../shared/utils/fs.utils';

const removeNestedNodeModulesTypes = (
  typeRoots: string[] | undefined
): string[] => {
  const types = 'node_modules/@types';
  const updatedTypeRoots = [types];

  if (typeRoots !== undefined) {
    const filtered =
      typeRoots.filter(typeRoot => !typeRoot.includes(types)) ?? [];
    updatedTypeRoots.push(...filtered);
  }
  return updatedTypeRoots;
};

export const makeTsconfigJsonIndependent = async (
  dir: string
): Promise<void> => {
  const tsconfigJson = await readTsconfigJson(dir);
  const updatedTsconfigJson = { ...tsconfigJson };
  const tsconfigPath = path.resolve(dir, TSCONFIG_JSON);

  if (updatedTsconfigJson.compilerOptions !== undefined) {
    updatedTsconfigJson.compilerOptions.typeRoots = removeNestedNodeModulesTypes(
      updatedTsconfigJson.compilerOptions.typeRoots
    );
  }
  return fs.outputJSON(tsconfigPath, updatedTsconfigJson, { spaces: 2 });
};

export const makePackageJsonIndependent = async (
  dir: string
): Promise<void> => {
  const packageJsonPath = path.resolve(dir, PACKAGE_JSON);
  const packageJson = await readPackageJson<CLI.Package.WorkspacePackageJSON>(
    dir
  );

  await fs.outputJSON(
    packageJsonPath,
    {
      ...packageJson,
      dependencies: {
        ...(packageJson?.dependencies ?? {}),
        ...migrationSetup.independency.dependencies
      },
      devDependencies: {
        ...(packageJson?.devDependencies ?? {}),
        ...migrationSetup.independency.devDependencies
      }
    },
    { spaces: 2 }
  );
};

export const copyIndependencyTemplate = (dir: string): Promise<void> =>
  fs.copy(
    path.resolve(__dirname, '../../../../templates/migration/independency'),
    dir,
    { overwrite: true, errorOnExist: false }
  );
