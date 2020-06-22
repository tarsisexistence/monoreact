import * as path from 'path';
import * as shell from 'shelljs';

shell.config.silent = true;

const rootDir = process.cwd();

const getStageName = (fixtureName: string): string => `stage-${fixtureName}`;

export function setupStage(testDir: string, fixtureName: string): void {
  const stagePath = path.join(rootDir, 'staging', getStageName(fixtureName));
  shell.mkdir(stagePath);
  shell.exec(
    `cp -a ${rootDir}/test/${testDir}/fixtures/${fixtureName}/. ${stagePath}/`
  );
  shell.ln(
    '-s',
    path.join(rootDir, 'node_modules'),
    path.join(stagePath, 'node_modules')
  );
  shell.cd(stagePath);
}

export function teardownStage(fixtureName: string): void {
  shell.cd(rootDir);
  shell.rm('-rf', path.join(rootDir, 'staging', getStageName(fixtureName)));
}
