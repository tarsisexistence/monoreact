import * as shell from 'shelljs';
import * as fs from 'fs-extra';
import * as path from 'path';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'execution';
const fixture = 'install-root-prod';
const template = 'install';

describe.skip('[bin.execution.install.root.prod]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture, template });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  const run = () => smartExec('node ../../../dist/bundle.cjs install monoreact routeshub');

  it('should install few prod dependencies in the root', () => {
    const output = run();
    const cwd = process.cwd();
    const rootPkg = fs.readJSONSync(path.resolve(cwd, 'package.json'));
    expect(rootPkg.dependencies).toHaveProperty('monoreact');
    expect(rootPkg.dependencies).toHaveProperty('routeshub');
    expect(output.code).toBe(0);
  });

  it('should install nothing but prod dependencies in the root', () => {
    const output = run();
    const cwd = process.cwd();
    const rootPkg = fs.readJSONSync(path.resolve(cwd, 'package.json'));
    const packagePkg = fs.readJSONSync(path.resolve(cwd, 'packages', 'install-example', 'package.json'));
    Object.keys({
      ...rootPkg.devDependencies,
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

  it('should not have tilde and caret (~, ^) in the root', () => {
    const output = run();
    const cwd = process.cwd();
    const rootPkg = fs.readJSONSync(path.resolve(cwd, 'package.json'));
    expect(rootPkg.dependencies.routeshub[0]).not.toBe('^');
    expect(rootPkg.dependencies.routeshub[0]).not.toBe('~');
    expect(rootPkg.dependencies['monoreact'][0]).not.toBe('^');
    expect(rootPkg.dependencies['monoreact'][0]).not.toBe('~');
    expect(output.code).toBe(0);
  });
});
