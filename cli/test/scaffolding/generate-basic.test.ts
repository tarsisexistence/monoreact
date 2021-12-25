import * as shell from 'shelljs';
import * as fs from 'fs-extra';
import * as path from 'path';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'scaffolding';
const fixture = 'generate-basic';
const template = 'generate';

describe('[bin.scaffolding.generate-basic]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture, template });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  const run = () => smartExec('node ../../../dist/bundle.cjs generate myBasicPackage --template basic');

  it('should generate package dir', () => {
    const output = run();
    expect(shell.test('-d', 'packages/myBasicPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have build of basic package', () => {
    const output = run();
    expect(shell.test('-d', 'packages/myBasicPackage/dist')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have utils example file', () => {
    const output = run();
    expect(shell.test('-f', 'packages/myBasicPackage/src/utils.ts')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should not have any dependency', () => {
    const output = run();
    const packageJson = fs.readJSONSync(path.resolve('packages', 'myBasicPackage', 'package.json'));
    expect(packageJson).not.toHaveProperty('dependencies');
    expect(packageJson).not.toHaveProperty('devDependencies');
    expect(packageJson).not.toHaveProperty('peerDependencies');
    expect(output.code).toBe(0);
  });
});
