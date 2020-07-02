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

  it('should have generated package by the specified path + package name', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage packageDir --template basic');
    expect(shell.test('-d', 'packageDir/myPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have updated workspaces declaration', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage packageDir --template basic');
    const rootPackageJson = fs.readJSONSync(path.resolve('package.json'));
    expect(rootPackageJson.workspaces).toContain('packageDir/myPackage');
    expect(output.code).toBe(0);
  });

  it('should have generated package by the specified path + package name', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage packageDir --template basic');
    expect(shell.test('-d', 'packageDir/myPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should generate package in the root', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage . --template basic');
    expect(shell.test('-d', 'myPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have updated workspaces declaration with package in the root', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage . --template basic');
    const rootPackageJson = fs.readJSONSync(path.resolve('package.json'));
    expect(rootPackageJson.workspaces).toContain('myPackage');
    expect(output.code).toBe(0);
  });

  it('should generate deep nested package', () => {
    const output = smartExec(
      'node ../../../dist/src/bin/index.js generate myPackage packages/components/helpers --template basic'
    );
    expect(shell.test('-d', 'packages/components/helpers/myPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });
});
