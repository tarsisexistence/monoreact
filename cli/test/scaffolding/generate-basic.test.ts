import * as shell from 'shelljs';
import * as fs from 'fs-extra';
import * as path from 'path';

import { setupStage, teardownStage } from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'scaffolding';
const fixtureName = 'generate-basic';
const template = 'generate';

describe('[bin.scaffolding.generate-basic]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName, template);
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should generate package dir', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myBasicPackage --template basic');
    expect(shell.test('-d', 'packages/myBasicPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have build basic package', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myBasicPackage --template basic');
    expect(shell.test('-d', 'packages/myBasicPackage/dist')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have utils example file', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myBasicPackage --template basic');
    expect(shell.test('-f', 'packages/myBasicPackage/src/utils.ts')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should not have any dependency', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js generate myBasicPackage --template basic');
    const packageJson = fs.readJSONSync(path.resolve('packages', 'myBasicPackage', 'package.json'));
    expect(packageJson).not.toHaveProperty('dependencies');
    expect(packageJson).not.toHaveProperty('devDependencies');
    expect(packageJson).not.toHaveProperty('peerDependencies');
    expect(output.code).toBe(0);
  });
});
