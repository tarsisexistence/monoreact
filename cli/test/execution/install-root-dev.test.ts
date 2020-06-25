import * as shell from 'shelljs';
import * as fs from 'fs-extra';
import * as path from 'path';

import { setupStage, teardownStage } from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'execution';
const fixtureName = 'install-root-dev';
const template = 'install';

describe('[bin.execution.install.root.dev]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName, template);
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should install only dev dependencies in the root', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js install @re-space/cli routeshub -D');
    const cwd = process.cwd();
    const rootPkg = fs.readJSONSync(path.resolve(cwd, 'package.json'));
    expect(rootPkg.devDependencies).toHaveProperty('@re-space/cli');
    expect(rootPkg.devDependencies).toHaveProperty('routeshub');
    expect(output.code).toBe(0);
  });

  it('should install nothing but dev dependencies in the root', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js install @re-space/cli routeshub -D');
    const cwd = process.cwd();
    const rootPkg = fs.readJSONSync(path.resolve(cwd, 'package.json'));
    const packagePkg = fs.readJSONSync(path.resolve(cwd, 'packages', 'install-example', 'package.json'));
    Object.keys({
      ...rootPkg.dependencies,
      ...rootPkg.peerDependencies,
      ...packagePkg.dependencies,
      ...packagePkg.devDependencies,
      ...packagePkg.peerDependencies
    }).forEach(dep => {
      expect(dep).not.toBe('@re-space/cli');
      expect(dep).not.toBe('routeshub');
    });
    expect(output.code).toBe(0);
  });
});
