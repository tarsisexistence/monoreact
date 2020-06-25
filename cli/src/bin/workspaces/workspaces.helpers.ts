import {
  color,
  getWorkspacesInfo,
  readWorkspacePackages,
  splitWorkspacesIntoDependencyGraph
} from '../../shared/utils';

export const withExcludedWorkspaces = (
  chunk: string[],
  excluded: Map<string, boolean>
): string[] => chunk.filter(name => !excluded.has(name));

const handleUnprocessedWorkspaces = (
  unprocessed: CLI.Workspaces.UnprocessedWorkspace[]
) => {
  console.log(
    color.error(`Potentially circular dependency
      Please check the following packages attentively:
      ${unprocessed.map(
        ([name, dependencies]) =>
          `   ${name}  =>  ${dependencies?.join(', ') ?? ''}`
      ).join(`
      `)}
      `)
  );
};

export const exposeWorkspacesInfo = async (): Promise<{
  chunks: string[][];
  packagesLocationMap: Record<string, string>;
}> => {
  const packagesInfo = await getWorkspacesInfo();
  const entries = packagesInfo.map(({ name, location }) => [name, location]);
  const packagesJsons = await readWorkspacePackages(packagesInfo);
  const { chunks, unprocessed } = splitWorkspacesIntoDependencyGraph(
    packagesJsons
  );
  const info = {
    chunks,
    packagesLocationMap: Object.fromEntries(entries)
  };

  if (unprocessed.length > 0) {
    handleUnprocessedWorkspaces(unprocessed);
  }

  return info;
};
