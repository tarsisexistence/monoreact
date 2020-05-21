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
      cwd: path.resolve(rootDir, repoDir),
      stdio: 'inherit'
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
    cwd: path.resolve(rootDir, repoDir),
    stdio: 'inherit'
  });
};

export const gitSubmoduleInit = async (rootDir: string) => {
  await execa('git', ['submodule', 'update', '--remote', '--init'], {
    cwd: rootDir,
    stdio: 'inherit'
  });
};
