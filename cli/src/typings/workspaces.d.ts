declare namespace CLI.Workspaces {
  type Command = 'build' | 'watch' | 'test' | 'lint';

  type WorkspaceChunk = string[];

  type UnprocessedWorkspace = [string, string[]];
}
