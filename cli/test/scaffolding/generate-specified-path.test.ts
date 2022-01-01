import * as shell from 'shelljs';
import * as fs from 'fs-extra';
import * as path from 'path';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;
const testDir = 'scaffolding';
const fixture = 'generate-specified-path';
const template = 'generate';

describe('[bin.scaffolding.generate-specified-path]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture, template });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  const run = () => smartExec('node ../../../dist/bundle.cjs generate myPackage packageDir --template basic');
  const runInRoot = () => smartExec('node ../../../dist/bundle.cjs generate myPackage . --template basic');
  const runNested = () =>
    smartExec('node ../../../dist/bundle.cjs generate myPackage packages/components/helpers --template basic');

  it('should have generated package by the specified path + package name', () => {
    const output = run();
    expect(shell.test('-d', 'packageDir/myPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have updated workspaces declaration', () => {
    const output = run();
    const rootPackageJson = fs.readJSONSync(path.resolve(process.cwd(), 'package.json'));
    expect(rootPackageJson.workspaces).toContain('packageDir/myPackage');
    expect(output.code).toBe(0);
  });

  it('should have generated package by the specified path + package name', () => {
    const output = run();
    expect(shell.test('-d', 'packageDir/myPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should generate package in the root', () => {
    const output = runInRoot();
    expect(shell.test('-d', 'myPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have updated workspaces declaration with package in the root', () => {
    const output = runInRoot();
    const rootPackageJson = fs.readJSONSync(path.resolve(process.cwd(), 'package.json'));
    expect(rootPackageJson.workspaces).toContain('myPackage');
    expect(output.code).toBe(0);
  });

  it('should generate deep nested package', () => {
    const output = runNested();
    expect(shell.test('-d', 'packages/components/helpers/myPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });
});
