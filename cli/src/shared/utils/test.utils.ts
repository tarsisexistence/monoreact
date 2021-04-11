import path from 'path';
import shell from 'shelljs';
import fs from 'fs-extra';

import { installDependencies } from './dependency.utils';

shell.config.silent = true;

const cache: Record<string, shell.ShellReturnValue> = {};

export function smartExec(command: string, { noCache = false } = {}): shell.ShellReturnValue {
  if (!noCache && cache[command]) {
    return cache[command];
  }

  const output = shell.exec(command);

  if (!noCache) {
    cache[command] = output;
  }

  return output;
}

const ROOT_DIR = process.cwd();
const STAGING_PATH = path.join(ROOT_DIR, 'test', '.staging');

const getStageName = (fixtureName: string): string => `stage-${fixtureName}`;

export const setupStage = ({
  testDir,
  fixture,
  template = fixture
}: {
  testDir: string;
  fixture: string;
  template?: string;
}): void => {
  shell.exec('yarn link', { silent: true });

  const stagePath = path.join(STAGING_PATH, getStageName(fixture));
  shell.mkdir(stagePath);
  shell.exec(`cp -a ${ROOT_DIR}/test/${testDir}/fixtures/${template}/. ${stagePath}/`);
  shell.cd(stagePath);

  // const shouldInstallDependencies = fs.existsSync(path.resolve(stagePath, 'yarn.lock'));

  // if (shouldInstallDependencies) {
  installDependencies();
  // }

  shell.exec('yarn link monoreact', { silent: true });
};

export const teardownStage = (fixtureName: string): void => {
  shell.cd(ROOT_DIR);
  shell.rm('-rf', path.join(STAGING_PATH, getStageName(fixtureName)));
};
