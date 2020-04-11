import { findWorkspaceRoot } from '../../helpers/utils/package.utils';
import { success } from '../../helpers/utils/color.utils';

export const getWorkspaceRootPath = async (): Promise<string> => {
  const workspaceRoot = await findWorkspaceRoot();

  if (workspaceRoot === null) {
    process.exit(1);
  }

  return workspaceRoot;
};

export const finished = ({
  cmd,
  type,
  code
}: {
  cmd: CLI.Submodules.Command;
  type: 'core' | 'submodules';
  code: number;
}) => success(`Finished ${cmd} ${type} with code ${code}`);
