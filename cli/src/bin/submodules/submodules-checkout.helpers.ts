import execa from 'execa';
import path from 'path';

export const smartCheckout = async ({
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
