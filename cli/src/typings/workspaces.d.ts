declare namespace CLI.Workspaces {
  type Command = 'build' | 'lint' | 'serve' | 'test';

  type WorkspaceChunk = string[];

  type UnprocessedWorkspace = [string, string[]];
}
