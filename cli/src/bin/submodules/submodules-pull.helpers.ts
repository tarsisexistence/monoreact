import execa from 'execa';
import path from 'path';

export const gitPull = async ({
  rootDir,
  remote,
  branch,
  repoDir = ''
}: {
  rootDir: string;
  remote: string;
  branch: string;
  repoDir?: string;
}) => {
  await execa('git', ['pull', remote, branch], {
    cwd: path.resolve(rootDir, repoDir),
    stdio: 'inherit'
  });
};
