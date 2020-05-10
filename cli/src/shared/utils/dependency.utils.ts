import fs from 'fs-extra';

import path from 'path';
import { error } from './color.utils';
import { getWorkspacesInfo } from './workspace.utils';
import BasePackageJSON = CLI.Package.BasePackageJSON;

const readWorkspacePackages = async (
  packagesInfo: CLI.Package.PackageInfo[]
): Promise<CLI.Package.BasePackageJSON[]> => {
  const packageJsons$: Promise<
    CLI.Package.BasePackageJSON
  >[] = packagesInfo.map((pkg: CLI.Package.PackageInfo) =>
    fs.readJSON(path.resolve(pkg.location, 'package.json'))
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
): { chunks: string[][]; unprocessed: [string, string[]][] } => {
  const chunks = [];
  const workspacePackagesMap: Record<
    string,
    CLI.Package.Dependencies
  > = Object.fromEntries(
    packageJsons.map(({ name, dependencies = {} }) => [name, dependencies])
  );
  const packageDependenciesMap: Map<string, string[]> = new Map();

  for (const json of packageJsons) {
    const { name, dependencies = {} } = json;
    packageDependenciesMap.set(
      name,
      Object.keys(dependencies).filter(
        dependency => workspacePackagesMap[dependency] !== undefined
      )
    );
  }

  let currentChunk: string[] = Array.from(packageDependenciesMap.keys()).reduce(
    (acc: string[], name) => {
      const hasWorkspaceDependencies =
        (packageDependenciesMap as any).get(name).length > 0;
      return hasWorkspaceDependencies ? acc : [...acc, name];
    },
    []
  );

  while (currentChunk.length > 0) {
    chunks.push(currentChunk);

    for (const name of currentChunk) {
      packageDependenciesMap.delete(name);
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
    unprocessed: Array.from(packageDependenciesMap.entries())
  };
};

export const getWorkspacesDependencyChunks = async (): Promise<string[][]> => {
  const packagesInfo = await getWorkspacesInfo();
  const packageJsons = await readWorkspacePackages(packagesInfo);
  const { chunks, unprocessed } = makeDependencyChunks(packageJsons);

  if (unprocessed.length > 0) {
    console.log(
      error(`Potentially circular dependency
Please check the following packages attentively:
${unprocessed.map(
  ([name, dependencies]) => `   ${name}  =>  ${dependencies?.join(', ') ?? ''}`
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
