import { success } from '../../shared/utils';

export const finished = ({
  cmd,
  type,
  code
}: {
  cmd: CLI.Submodules.Command;
  type: 'core' | 'submodules';
  code: number;
}) => success(`Finished ${cmd} '${type}' with code ${code}`);
