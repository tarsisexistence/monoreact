import { error } from '../../shared/utils';

export const withExcludedWorkspaces = (
  chunk: string[],
  excluded: Map<string, boolean>
): string[] => chunk.filter(name => !excluded.has(name));

export const handleUnprocessedWorkspaces = (
  unprocessed: CLI.Workspaces.UnprocessedWorkspace[]
) => {
  console.log(
    error(`Potentially circular dependency
      Please check the following packages attentively:
      ${unprocessed.map(
        ([name, dependencies]) =>
          `   ${name}  =>  ${dependencies?.join(', ') ?? ''}`
      ).join(`
      `)}
      `)
  );
};
