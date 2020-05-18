import { readPackageJson } from './fs.utils';

export const readWorkspacePackages = async (
  packagesInfo: CLI.Package.PackageInfo[]
): Promise<CLI.Package.BasePackageJSON[]> => {
  const packageJsons$: Promise<
    CLI.Package.BasePackageJSON
  >[] = packagesInfo.map((pkg: CLI.Package.PackageInfo) =>
    readPackageJson(pkg.location)
  );
  const settledPackageJsons = (await Promise.allSettled<
    Promise<CLI.Package.BasePackageJSON>
  >(packageJsons$)) as PromiseFulfilledResult<CLI.Package.BasePackageJSON>[];
  return settledPackageJsons.map(
    settledPackageJson => settledPackageJson.value
  );
};

export const splitWorkspacesIntoDependencyGraph = (
  workspaces: Pick<CLI.Package.BasePackageJSON, 'name' | 'dependencies'>[]
): {
  chunks: CLI.Workspaces.WorkspaceChunk[];
  unprocessed: CLI.Workspaces.UnprocessedWorkspace[];
} => {
  const chunks = [];
  const workspacePackagesMap: Record<
    string,
    CLI.Package.Dependencies
  > = Object.fromEntries(
    workspaces.map(({ name, dependencies = {} }) => [name, dependencies])
  );
  const packageDependenciesMap: Map<string, string[]> = new Map();

  for (const { name, dependencies = {} } of workspaces) {
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
