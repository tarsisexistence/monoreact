import execa from 'execa';
import path from 'path';

export const gitFetch = async ({ rootDir, repoDir = '' }: { rootDir: string; repoDir?: string }): Promise<void> => {
  await execa('git', ['fetch', '--all'], {
    cwd: path.resolve(rootDir, repoDir),
    stdio: 'inherit'
  });
};
