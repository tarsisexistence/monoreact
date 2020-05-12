import { error, highlight, info, success, underline } from '../utils';
import packageJson from '../../../package.json';

export class WorkspacesMessages {
  introduce = () => underline(`${packageJson.name} v${packageJson.version}`);

  compiling = () => `
${info('Compiling modules...')}`;

  failed = () => error(`Failed to compile workspaces`);

  successful = ([s, ms]: [number, number]) =>
    success('Compiled in ') + highlight(`${s}.${ms.toString().slice(0, 3)}s.`);

  done = (duration: number) => {
    const [s, ms] = (duration / 1000).toString().split('.');
    return success(`Done in ${s}.${ms.slice(0, 3)}s.`);
  };

  entering = (name: string) => info(`Entered ${name}`);

  compiled = (name: string) => success(`Compiled ${name}`);
}
