import { exec } from 'shelljs';

export const getSubmodulesLocations = async (): Promise<string[]> => {
  const shell = exec("git submodule foreach --quiet 'echo $name'", {
    silent: true
  });
  const { stdout: submodulesInfo } = shell;
  return submodulesInfo.trim().split('\n');
};
