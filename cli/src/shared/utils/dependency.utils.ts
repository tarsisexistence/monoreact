import fs from 'fs-extra';

import path from 'path';
import { error } from './color.utils';
import { getWorkspacesInfo } from './workspace.utils';
import BasePackageJSON = CLI.Package.BasePackageJSON;

const readWorkspacesDependencies = async (
  packagesInfo: CLI.Package.Package[]
): Promise<CLI.Package.BasePackageJSON[]> => {
  const packageJsons$: Promise<
    CLI.Package.BasePackageJSON
  >[] = packagesInfo.map((pkg: CLI.Package.Package) =>
    fs.readJSON(path.resolve(pkg.path, 'package.json'))
  );
  const settledPackageJsons = (await Promise.allSettled<
    Promise<CLI.Package.BasePackageJSON>
  >(packageJsons$)) as PromiseFulfilledResult<BasePackageJSON>[];
  return settledPackageJsons.map(
    settledPackageJson => settledPackageJson.value
  );
};

export const makeDependencyChunks = (
  packageJsons: Pick<CLI.Package.BasePackageJSON, 'name' | 'dependencies'>[]
): { chunks: string[][]; unprocessedDependencies: Map<string, string[]> } => {
  const chunks = [];
  const workspacePackagesMap: Record<
    string,
    CLI.Package.Dependencies
  > = Object.fromEntries(
    packageJsons.map(({ name, dependencies = {} }) => [name, dependencies])
  );
  const packageDependenciesMap: Map<string, string[]> = new Map();

  for (const pkgJson of packageJsons) {
    const { name, dependencies = {} } = pkgJson;
    packageDependenciesMap.set(
      name,
      Object.keys(dependencies).filter(
        dependency => workspacePackagesMap[dependency] !== undefined
      )
    );
  }

  let currentChunk: string[] = Array.from(packageDependenciesMap.keys()).reduce(
    (acc: string[], pkgName) => {
      const hasWorkspaceDependencies =
        (packageDependenciesMap as any).get(pkgName).length > 0;
      return hasWorkspaceDependencies ? acc : [...acc, pkgName];
    },
    []
  );

  while (currentChunk.length > 0) {
    chunks.push(currentChunk);

    for (const pkgName of currentChunk) {
      packageDependenciesMap.delete(pkgName);
    }

    currentChunk = Array.from(packageDependenciesMap.keys()).filter(pkg => {
      const deps =
        packageDependenciesMap
          .get(pkg)
          ?.filter(dep => packageDependenciesMap.has(dep)) ?? [];
      packageDependenciesMap.set(pkg, deps);
      return deps.length === 0;
    });
  }

  return {
    chunks,
    unprocessedDependencies: packageDependenciesMap
  };
};

export const getWorkspacesDependencyChunks = async (): Promise<string[][]> => {
  const packagesInfo = await getWorkspacesInfo();
  const packageJsons = await readWorkspacesDependencies(packagesInfo);
  const { chunks, unprocessedDependencies } = makeDependencyChunks(
    packageJsons
  );

  if (unprocessedDependencies.size > 0) {
    console.log(
      error(`Potentially circular dependency
Please check the following packages attentively:
${Array.from(unprocessedDependencies.keys()).map(
  pkgName =>
    `   ${pkgName}  =>  ${
      unprocessedDependencies.get(pkgName)?.join(', ') ?? ''
    }`
).join(`
`)}
`)
    );
  }

  return chunks;
};

// 0
// 1: 0
// 2: 0
// 3: 1, 2
// 4: 3

// check circularity (0: 2 | 1: 0 | 2: 0 | 3: 1, 2 | 4: 3)
// check circularity of nested deps (it won't build all package (0 | 1: 2 | 2: 1 | 3: 1, 2 | 4: 3)

// 0
// 1: 0
// 2: 0,1
// 3: 1,2
// 4: 3
