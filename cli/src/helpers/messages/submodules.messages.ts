import { PACKAGE_JSON } from '../constants/package.const';
import { inverse, error, success } from '../utils/color.utils';

export class SubmodulesMessages {
  // eslint-disable-next-line no-empty-function
  constructor(private cmd: CLI.SubmodulesCommand) {}

  script = () => inverse(` submodule ${this.cmd} `);

  wrongWorkspace = () => `
    Make sure you run the script submodule ${this.cmd} from the workspace root

    The workspace root ${PACKAGE_JSON} should have:
        private: false;
        workspaces: ['packages/*']
          `;

  specifyParams = () =>
    error(
      `${this.cmd} params are not specified. This command should have additional parameters like target.`
    );

  notFound = () => error('Command not found.');

  finished = ({
    cmd,
    code,
    type
  }: {
    cmd: CLI.SubmodulesCommand;
    type: 'core' | 'submodules';
    code: number;
  }) => success(`Finished ${cmd} ${type} with code ${code}`);
}
