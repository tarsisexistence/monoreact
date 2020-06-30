import * as shell from 'shelljs';

import { setupStage, teardownStage } from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;
const testDir = 'scaffolding';
const fixtureName = 'new-cra';
const template = 'new';

describe('[bin.scaffolding.new-cra]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName, { template });
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should create new project', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js new myProject --template cra');
    expect(shell.test('-d', 'myProject')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have project directories', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js new myProject --template cra');
    expect(shell.test('-d', 'myProject/public')).toBeTruthy();
    expect(shell.test('-d', 'myProject/src')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have necessary project files', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js new myProject --template cra');
    expect(shell.test('-f', 'myProject/package.json')).toBeTruthy();
    expect(shell.test('-f', 'myProject/tsconfig.json')).toBeTruthy();
    expect(shell.test('-f', 'myProject/README.md')).toBeTruthy();
    expect(shell.test('-f', 'myProject/.gitignore')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have additional boilerplate config files', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js new myProject --template cra');
    expect(shell.test('-f', 'myProject/.eslintrc.js')).toBeTruthy();
    expect(shell.test('-f', 'myProject/.huskyrc.json')).toBeTruthy();
    expect(shell.test('-f', 'myProject/.lintstagedrc.json')).toBeTruthy();
    expect(shell.test('-f', 'myProject/.prettierrc.json')).toBeTruthy();
    expect(shell.test('-f', 'myProject/.stylelintrc.json')).toBeTruthy();
    expect(output.code).toBe(0);
  });
});
