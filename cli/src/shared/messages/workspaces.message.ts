import { color } from '../utils';
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
  introduce: () =>
    color.underline(`${packageJson.name} v${packageJson.version}`),
  running: (name: string) => color.details(`Running ${name}`),

  started: (cmd: CLI.Workspaces.Command) => `
${color.info(`${startingTextByCommand[cmd]} modules...`)}`,
  finished: (cmd: CLI.Workspaces.Command, name: string) =>
    color.success(`${finishingTextByCommand[cmd]} ${name}`),

  failed: () => color.error(`Failed to compile workspaces`),
  successful: ([s, ms]: [number, number]) =>
    color.success('Done in ') +
    color.highlight(`${s}.${ms.toString().slice(0, 3)}s.`)
} as const;
