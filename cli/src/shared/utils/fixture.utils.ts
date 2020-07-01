import path from 'path';
import shell from 'shelljs';
import fs from 'fs-extra';
import { installDependencies } from './common.utils';

shell.config.silent = true;

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
  const stagePath = path.join(STAGING_PATH, getStageName(fixture));
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
  shell.rm('-rf', path.join(STAGING_PATH, getStageName(fixtureName)));
};
