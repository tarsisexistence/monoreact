import { error, info } from '../utils';

export class InstallMessages {
  private dependencies: string;

  // eslint-disable-next-line no-empty-function
  constructor(deps: string[]) {
    this.dependencies = deps.join(' ');
  }

  successful = () =>
    `Successfully installed [${info(this.dependencies)}] dependencies`;

  installing = () => `Installing [${info(this.dependencies)}] dependencies...`;

  failed = () => `Failed to install [${error(this.dependencies)}] dependencies`;
}
