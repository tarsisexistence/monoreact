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
const STAGE_PATH = path.join(ROOT_DIR, 'test', '.stage');

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
  const stagePath = path.join(STAGE_PATH, getStageName(fixture));
  shell.mkdir(stagePath);
  shell.exec(`cp -a ${ROOT_DIR}/test/${testDir}/fixtures/${template}/. ${stagePath}/`);
  shell.cd(stagePath);

  const shouldInstallDependencies = fs.existsSync(path.resolve(stagePath, 'yarn.lock'));

  if (shouldInstallDependencies) {
    installDependencies();
  }
};

export const teardownStage = (fixtureName: string): void => {
  shell.cd(ROOT_DIR);
  shell.rm('-rf', path.join(STAGE_PATH, getStageName(fixtureName)));
};
