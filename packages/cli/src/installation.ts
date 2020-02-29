import execa from 'execa';

let cmd: InstallCommand;

type InstallCommand = 'yarn' | 'npm';

export async function getInstallCmd(): Promise<InstallCommand> {
  if (cmd) {
    return cmd;
  }

  try {
    await execa('yarnpkg', ['--version']);
    cmd = 'yarn';
  } catch (e) {
    cmd = 'npm';
  }

  return cmd;
}
