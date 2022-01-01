import * as shell from 'shelljs';
import * as fs from 'fs-extra';
import * as path from 'path';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'execution';
const fixture = 'install-package-dev';
const template = 'install';

describe.skip('[bin.execution.install.package.dev]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture, template });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  const run = () => smartExec('node ../../../../../dist/bundle.cjs install monoreact routeshub -D');

  it('should install dev dependencies for package and root', () => {
    const cwd = process.cwd();
    const packageDir = path.resolve(cwd, 'packages', 'install-example');
    shell.cd(packageDir);
    const output = run();
    shell.cd(cwd);
    const rootPkg = fs.readJSONSync(path.resolve(cwd, 'package.json'));
    const packagePkg = fs.readJSONSync(path.resolve(packageDir, 'package.json'));
    expect(rootPkg.devDependencies).toHaveProperty('monoreact');
    expect(rootPkg.devDependencies).toHaveProperty('routeshub');
    expect(packagePkg.devDependencies).toHaveProperty('monoreact');
    expect(packagePkg.devDependencies).toHaveProperty('routeshub');
    expect(output.code).toBe(0);
  });

  it('should install nothing but dev dependencies for package and root', () => {
    const cwd = process.cwd();
    const packageDir = path.resolve(cwd, 'packages', 'install-example');
    shell.cd(packageDir);
    const output = run();
    shell.cd(cwd);
    const rootPkg = fs.readJSONSync(path.resolve(cwd, 'package.json'));
    const packagePkg = fs.readJSONSync(path.resolve(packageDir, 'package.json'));
    Object.keys({
      ...rootPkg.dependencies,
      ...rootPkg.peerDependencies,
      ...packagePkg.dependencies,
      ...packagePkg.peerDependencies
    }).forEach(dep => {
      expect(dep).not.toBe('monoreact');
      expect(dep).not.toBe('routeshub');
    });
    expect(output.code).toBe(0);
  });
});
