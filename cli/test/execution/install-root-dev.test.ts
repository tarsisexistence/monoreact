import * as shell from 'shelljs';
import * as fs from 'fs-extra';
import * as path from 'path';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'execution';
const fixture = 'install-root-dev';
const template = 'install';

describe.skip('[bin.execution.install.root.dev]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture, template });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  it('should install only dev dependencies in the root', () => {
    const output = smartExec('node ../../../dist/bundle.cjs install monoreact routeshub -D');
    const cwd = process.cwd();
    const rootPkg = fs.readJSONSync(path.resolve(cwd, 'package.json'));
    expect(rootPkg.devDependencies).toHaveProperty('monoreact');
    expect(rootPkg.devDependencies).toHaveProperty('routeshub');
    expect(output.code).toBe(0);
  });

  it('should install nothing but dev dependencies in the root', () => {
    const output = smartExec('node ../../../dist/bundle.cjs install monoreact routeshub -D');
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
      expect(dep).not.toBe('monoreact');
      expect(dep).not.toBe('routeshub');
    });
    expect(output.code).toBe(0);
  });
});
