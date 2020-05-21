import execa from 'execa';

export const gitSubmoduleInit = async (rootDir: string) => {
  await execa('git', ['submodule', 'update', '--remote', '--init'], {
    cwd: rootDir,
    stdio: 'inherit'
  });
};
