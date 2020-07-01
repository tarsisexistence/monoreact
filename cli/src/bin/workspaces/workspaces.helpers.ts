import { color, getWorkspaceInfo, readWorkspacePackages, splitWorkspaceIntoDependencyGraph } from '../../shared/utils';

export const withExcludedPackages = (chunk: string[], excluded: Map<string, boolean>): string[] =>
  chunk.filter(name => !excluded.has(name));

const handleUnprocessedPackages = (unprocessed: CLI.Workspaces.UnprocessedWorkspace[]) => {
  console.log(
    color.error(`Potentially circular dependency
      Please check the following packages attentively:
      ${unprocessed.map(([name, dependencies]) => `   ${name}  =>  ${dependencies?.join(', ') ?? ''}`).join(`
      `)}
      `)
  );
};

export const exposeWorkspaceInfo = async (): Promise<{
  chunks: string[][];
  packagesLocationMap: Record<string, string>;
}> => {
  const packagesInfo = await getWorkspaceInfo();
  const entries = packagesInfo.map(({ name, location }) => [name, location]);
  const packagesJsons = await readWorkspacePackages(packagesInfo);
  const { chunks, unprocessed } = splitWorkspaceIntoDependencyGraph(packagesJsons);
  const info = {
    chunks,
    packagesLocationMap: Object.fromEntries(entries)
  };

  if (unprocessed.length > 0) {
    handleUnprocessedPackages(unprocessed);
  }

  return info;
};
