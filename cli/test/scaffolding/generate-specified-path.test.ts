import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';
import { getJsonByRelativePath } from '../utils';

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

  it('should have generated package with custom path', () => {
    const output = smartExec('node ../../../dist/bundle.cjs generate myPackage myCustomDir --template basic');
    expect(shell.test('-d', 'myCustomDir/myPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have updated workspaces declaration after generating package with custom path', () => {
    const output = smartExec('node ../../../dist/bundle.cjs generate myPackage2 myCustomDir --template basic');
    const rootPackageJson = getJsonByRelativePath('package.json');
    expect(rootPackageJson.workspaces).toContain('myCustomDir/myPackage2');
    expect(output.code).toBe(0);
  });

  it('should generate package in the root', () => {
    const output = smartExec('node ../../../dist/bundle.cjs generate myRootPackage . --template basic');
    expect(shell.test('-d', 'myRootPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have updated workspaces declaration with package in the root', () => {
    const output = smartExec('node ../../../dist/bundle.cjs generate myRootPackage2 . --template basic');
    const rootPackageJson = getJsonByRelativePath('package.json');
    expect(rootPackageJson.workspaces).toContain('myRootPackage2');
    expect(output.code).toBe(0);
  });

  it('should generate deep nested package', () => {
    const output = smartExec(
      'node ../../../dist/bundle.cjs generate deepNestedPackage packages/components/helpers --template basic'
    );
    expect(shell.test('-d', 'packages/components/helpers/deepNestedPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });
});
