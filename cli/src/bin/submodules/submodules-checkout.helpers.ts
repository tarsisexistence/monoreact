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
}): Promise<void> => {
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
