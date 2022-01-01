import * as shell from 'shelljs';
import * as fs from 'fs-extra';
import * as path from 'path';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'execution';
const fixture = 'install-package-prod';
const template = 'install';

describe.skip('[bin.execution.install.package.prod]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture, template });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  const run = () => smartExec('node ../../../../../dist/bundle.cjs install monoreact routeshub');

  it('should install peer dependencies in the package and prod in the root', () => {
    const cwd = process.cwd();
    const packageDir = path.resolve(cwd, 'packages', 'install-example');
    shell.cd(packageDir);
    const output = run();
    shell.cd(cwd);
    const rootPkg = fs.readJSONSync(path.resolve(cwd, 'package.json'));
    const packagePkg = fs.readJSONSync(path.resolve(packageDir, 'package.json'));

    expect(rootPkg.dependencies).toHaveProperty('monoreact');
    expect(rootPkg.dependencies).toHaveProperty('routeshub');
    expect(packagePkg.peerDependencies).toHaveProperty('monoreact');
    expect(packagePkg.peerDependencies).toHaveProperty('routeshub');
    expect(output.code).toBe(0);
  });

  it('should install nothing but peer dependencies in the package and prod in the root', () => {
    const cwd = process.cwd();
    const packageDir = path.resolve(cwd, 'packages', 'install-example');
    shell.cd(packageDir);
    const output = run();
    shell.cd(cwd);
    const rootPkg = fs.readJSONSync(path.resolve(cwd, 'package.json'));
    const packagePkg = fs.readJSONSync(path.resolve(cwd, 'packages', 'install-example', 'package.json'));
    Object.keys({
      ...rootPkg.devDependencies,
      ...rootPkg.peerDependencies,
      ...packagePkg.dependencies,
      ...packagePkg.devDependencies
    }).forEach(dep => {
      expect(dep).not.toBe('monoreact');
      expect(dep).not.toBe('routeshub');
    });
    expect(output.code).toBe(0);
  });

  it('should have caret (^) in the package', () => {
    const cwd = process.cwd();
    const packageDir = path.resolve(cwd, 'packages', 'install-example');
    shell.cd(packageDir);
    const output = run()
    shell.cd(cwd);
    const packagePkg = fs.readJSONSync(path.resolve(cwd, 'packages', 'install-example', 'package.json'));
    expect(packagePkg.peerDependencies.routeshub[0]).toBe('^');
    expect(packagePkg.peerDependencies.routeshub[0]).not.toBe('~');
    expect(packagePkg.peerDependencies['monoreact'][0]).toBe('^');
    expect(packagePkg.peerDependencies['monoreact'][0]).not.toBe('~');
    expect(output.code).toBe(0);
  });
});
