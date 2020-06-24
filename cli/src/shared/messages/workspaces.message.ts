import { details, error, highlight, info, success, underline } from '../utils';
import packageJson from '../../../package.json';

const startingTextByCommand: Record<CLI.Workspaces.Command, string> = {
  build: 'Compiling',
  lint: 'Linting',
  serve: 'Start watching',
  test: 'Testing'
};

const finishingTextByCommand: Record<CLI.Workspaces.Command, string> = {
  build: 'Compiled',
  lint: 'Linted',
  serve: 'Finished watching',
  test: 'Tested'
};

export const workspacesMessage = {
  introduce: () => underline(`${packageJson.name} v${packageJson.version}`),
  running: (name: string) => details(`Running ${name}`),

  started: (cmd: CLI.Workspaces.Command) => `
${info(`${startingTextByCommand[cmd]} modules...`)}`,
  finished: (cmd: CLI.Workspaces.Command, name: string) =>
    success(`${finishingTextByCommand[cmd]} ${name}`),

  failed: () => error(`Failed to compile workspaces`),
  successful: ([s, ms]: [number, number]) =>
    success('Done in ') + highlight(`${s}.${ms.toString().slice(0, 3)}s.`)
} as const;
