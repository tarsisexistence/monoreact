import * as path from 'path';
import * as shell from 'shelljs';
import { installDependencies } from './common.utils';

shell.config.silent = true;

const ROOT_DIR = process.cwd();
const STAGING_PATH = path.join(ROOT_DIR, 'test', '.staging');

const getStageName = (fixtureName: string): string => `stage-${fixtureName}`;

export function setupStage(
  testDir: string,
  fixtureName: string,
  { template, install }: Partial<{ template: string; install: boolean }> = { template: undefined, install: false }
): void {
  const stagePath = path.join(STAGING_PATH, getStageName(fixtureName));
  shell.mkdir(stagePath);
  shell.exec(`cp -a ${ROOT_DIR}/test/${testDir}/fixtures/${template || fixtureName}/. ${stagePath}/`);
  shell.cd(stagePath);

  if (install) {
    installDependencies();
  }
}

export function teardownStage(fixtureName: string): void {
  shell.cd(ROOT_DIR);
  shell.rm('-rf', path.join(STAGING_PATH, getStageName(fixtureName)));
}
