import * as shell from 'shelljs';
import * as fs from 'fs-extra';
import * as path from 'path';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;
const testDir = 'scaffolding';
const fixture = 'generate-default';
const template = 'generate';

describe('[bin.scaffolding.generate-default]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture, template });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  it('should have generated package dir after', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage --template basic');
    expect(shell.test('-d', 'packages/myPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have build folder', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage --template basic');
    expect(shell.test('-d', 'packages/myPackage/dist')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have generated bundle', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage --template basic');
    expect(shell.test('-f', 'packages/myPackage/dist/bundle.js')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have README.md', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage --template basic');
    expect(shell.test('-f', 'packages/myPackage/README.md')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have tsconfig.json', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage --template basic');
    expect(shell.test('-f', 'packages/myPackage/README.md')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have .gitignore', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage --template basic');
    expect(shell.test('-f', 'packages/myPackage/README.md')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have .eslintrc.json', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage --template basic');
    expect(shell.test('-f', 'packages/myPackage/README.md')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should update workspaces declaration', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage --template basic');
    const rootPackageJson = fs.readJSONSync(path.resolve('package.json'));
    expect(rootPackageJson.workspaces).toContain('packages/myPackage');
    expect(output.code).toBe(0);
  });

  it('should have correct namespace and package name in the package.json', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage --template basic');
    const packageJson = fs.readJSONSync(path.resolve('packages', 'myPackage', 'package.json'));
    expect(packageJson.name).toBe('@scaffolding-generate/mypackage');
    expect(output.code).toBe(0);
  });

  it('should have necessary package.json monoreact information', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage --template basic');
    const packageJson = fs.readJSONSync(path.resolve('packages', 'myPackage', 'package.json'));
    expect(packageJson.private).toBeFalsy();
    expect(packageJson.workspace).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have defined author name in package.json', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage --template basic');
    const packageJson = fs.readJSONSync(path.resolve('packages', 'myPackage', 'package.json'));
    expect(packageJson).toHaveProperty('author');
    expect(packageJson.author.length).toBeGreaterThan(0);
    expect(output.code).toBe(0);
  });

  it('should have necessary package.json info for bundling', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage --template basic');
    const packageJson = fs.readJSONSync(path.resolve('packages', 'myPackage', 'package.json'));
    expect(packageJson.module).toBe('dist/bundle.js');
    expect(packageJson.source).toBe('src/publicApi.ts');
    expect(packageJson.types).toBe('dist/publicApi.d.ts');
    expect(output.code).toBe(0);
  });

  it('should have other package properties', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myPackage --template basic');
    const packageJson = fs.readJSONSync(path.resolve('packages', 'myPackage', 'package.json'));
    expect(packageJson.scripts).toHaveProperty('build');
    expect(packageJson.scripts).toHaveProperty('start');
    expect(packageJson.scripts).toHaveProperty('lint');
    expect(packageJson.scripts).toHaveProperty('test');
    expect(packageJson.scripts).toHaveProperty('prepublishOnly');
    expect(packageJson).toHaveProperty('publishConfig');
    expect(packageJson).toHaveProperty('license');
    expect(output.code).toBe(0);
  });
});
