import execa from 'execa';
import path from 'path';

export const smartGitCheckout = async ({
  rootDir,
  branch,
  repoDir = ''
}: {
  rootDir: string;
  branch: string;
  repoDir?: string;
}) => {
  try {
    await execa('git', ['checkout', branch], {
      stdio: 'inherit',
      cwd: path.resolve(rootDir, repoDir)
    });
  } catch {
    await execa('git', ['checkout', '-b', branch], {
      stdio: 'inherit',
      cwd: path.resolve(rootDir, repoDir)
    });
  }
};

export const gitFetch = async ({
  rootDir,
  repoDir = ''
}: {
  rootDir: string;
  repoDir?: string;
}) => {
  await execa('git', ['fetch', '--all'], {
    stdio: 'inherit',
    cwd: path.resolve(rootDir, repoDir)
  });
};
