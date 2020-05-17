import fs from 'fs-extra';
import { migrationSetup } from '../../setup/migration';
import { TsconfigJSON } from '../../typings/tsconfig';
import path from 'path';

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

export const makeTsconfigJsonIndependent = (
  path: string,
  data: TsconfigJSON
): Promise<void> => {
  const updatedTsconfigJson = { ...data };

  if (updatedTsconfigJson.compilerOptions !== undefined) {
    updatedTsconfigJson.compilerOptions.typeRoots = removeNestedNodeModulesTypes(
      updatedTsconfigJson.compilerOptions.typeRoots
    );
  }
  return fs.outputJSON(path, updatedTsconfigJson, { spaces: 2 });
};

export const makePackageJsonIndependent = async (
  path: string,
  data: CLI.Package.WorkspacePackageJSON
): Promise<void> =>
  await fs.outputJSON(
    path,
    {
      ...data,
      dependencies: {
        ...(data?.dependencies ?? {}),
        ...migrationSetup.independency.dependencies
      },
      devDependencies: {
        ...(data?.devDependencies ?? {}),
        ...migrationSetup.independency.devDependencies
      }
    },
    { spaces: 2 }
  );

export const copyIndependencyTemplate = (dir: string): Promise<void> =>
  fs.copy(
    path.resolve(__dirname, '../../../../templates/migration/independency'),
    dir,
    { overwrite: true, errorOnExist: false }
  );
