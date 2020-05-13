import { details, error, highlight, info, success, underline } from '../utils';
import packageJson from '../../../package.json';

export class WorkspacesMessages {
  introduce = () => underline(`${packageJson.name} v${packageJson.version}`);
  running = (name: string) => details(`Running ${name}`);

  compiling = () => `
${info('Compiling modules...')}`;
  compiled = (name: string) => success(`Compiled ${name}`);
  failed = () => error(`Failed to compile workspaces`);

  tested = (name: string) => success(`Tested ${name}`);
  testing = () => `
${info('Testing modules...')}`;

  successful = ([s, ms]: [number, number]) =>
    success('Done in ') + highlight(`${s}.${ms.toString().slice(0, 3)}s.`);
}
