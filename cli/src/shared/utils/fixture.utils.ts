import * as path from 'path';
import * as shell from 'shelljs';

shell.config.silent = true;

const ROOT_DIR = process.cwd();
const STAGING_PATH = path.join(ROOT_DIR, 'test', '.staging');

const getStageName = (fixtureName: string): string => `stage-${fixtureName}`;

export function setupStage(
  testDir: string,
  fixtureName: string,
  templateName?: string
): void {
  const stagePath = path.join(STAGING_PATH, getStageName(fixtureName));
  shell.mkdir(stagePath);
  shell.exec(
    `cp -a ${ROOT_DIR}/test/${testDir}/fixtures/${
      templateName || fixtureName
    }/. ${stagePath}/`
  );
  shell.ln(
    '-s',
    path.join(ROOT_DIR, 'node_modules'),
    path.join(stagePath, 'node_modules')
  );
  shell.cd(stagePath);
}

export function teardownStage(fixtureName: string): void {
  shell.cd(ROOT_DIR);
  shell.rm('-rf', path.join(STAGING_PATH, getStageName(fixtureName)));
}
