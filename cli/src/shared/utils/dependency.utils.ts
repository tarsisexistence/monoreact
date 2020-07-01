import { readPackageJson } from './fs.utils';

export const readWorkspacePackages = async (
  packagesInfo: CLI.Package.PackageInfo[]
): Promise<CLI.Package.BasePackageJSON[]> => {
  const packageJsons$: Promise<CLI.Package.BasePackageJSON>[] = packagesInfo.map((pkg: CLI.Package.PackageInfo) =>
    readPackageJson(pkg.location)
  );
  const settledPackageJsons = (await Promise.allSettled<Promise<CLI.Package.BasePackageJSON>>(
    packageJsons$
  )) as PromiseFulfilledResult<CLI.Package.BasePackageJSON>[];
  return settledPackageJsons.map(settledPackageJson => settledPackageJson.value);
};

export const splitWorkspaceIntoDependencyGraph = (
  workspaces: Pick<CLI.Package.PackagePackageJSON, 'name' | 'dependencies' | 'devDependencies' | 'peerDependencies'>[]
): {
  chunks: CLI.Workspaces.WorkspaceChunk[];
  unprocessed: CLI.Workspaces.UnprocessedWorkspace[];
} => {
  const chunks = [];
  const workspacePackagesMap: Record<string, CLI.Package.Dependencies> = Object.fromEntries(
    workspaces.map(({ name, dependencies = {}, devDependencies = {}, peerDependencies = {} }) => [
      name,
      {
        ...dependencies,
        ...devDependencies,
        ...peerDependencies
      }
    ])
  );
  const packageDependenciesMap: Map<string, string[]> = new Map();

  for (const workspacePackage in workspacePackagesMap) {
    packageDependenciesMap.set(
      workspacePackage,
      Object.keys(workspacePackagesMap[workspacePackage]).filter(
        dependency => workspacePackagesMap[dependency] !== undefined
      )
    );
  }

  let currentChunk: string[] = Array.from(packageDependenciesMap.keys()).reduce((acc: string[], name) => {
    const hasWorkspaceDependencies = (packageDependenciesMap as any).get(name).length > 0;
    return hasWorkspaceDependencies ? acc : [...acc, name];
  }, []);

  while (currentChunk.length > 0) {
    chunks.push(currentChunk);

    for (const name of currentChunk) {
      packageDependenciesMap.delete(name);
    }

    currentChunk = Array.from(packageDependenciesMap.keys()).filter(pkg => {
      const deps = packageDependenciesMap.get(pkg)?.filter(dep => packageDependenciesMap.has(dep)) ?? [];
      packageDependenciesMap.set(pkg, deps);
      return deps.length === 0;
    });
  }

  return {
    chunks,
    unprocessed: Array.from(packageDependenciesMap.entries())
  };
};

export const getExternalScreen = ({
  dependencies = {},
  peerDependencies = {},
  devDependencies = {}
}: Partial<{
  dependencies: CLI.Package.Dependencies;
  peerDependencies: CLI.Package.Dependencies;
  devDependencies: CLI.Package.Dependencies;
}>): ((id: string) => boolean) => {
  const externals = [...Object.keys(dependencies), ...Object.keys(peerDependencies), ...Object.keys(devDependencies)];
  const externalsMap = new Map(externals.map(key => [key, key]));

  return (id: string) => externalsMap.has(id) || Boolean(externals.find(key => id.startsWith(`${key}/`)));
};
