import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;
const testDir = 'scaffolding';
const fixture = 'new-cra';
const template = 'new';

describe('[bin.scaffolding.new-cra]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture, template });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  const run = () => smartExec('node ../../../dist/bundle.cjs new myProject --template cra');

  it('should create new project', () => {
    const output = run();
    expect(shell.test('-d', 'myProject')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have project directories', () => {
    const output = run();
    expect(shell.test('-d', 'myProject/public')).toBeTruthy();
    expect(shell.test('-d', 'myProject/src')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have necessary project files', () => {
    const output = run();
    expect(shell.test('-f', 'myProject/package.json')).toBeTruthy();
    expect(shell.test('-f', 'myProject/tsconfig.json')).toBeTruthy();
    expect(shell.test('-f', 'myProject/README.md')).toBeTruthy();
    expect(shell.test('-f', 'myProject/.gitignore')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have additional boilerplate config files', () => {
    const output = run();
    expect(shell.test('-f', 'myProject/.eslintrc.js')).toBeTruthy();
    expect(shell.test('-f', 'myProject/.huskyrc.json')).toBeTruthy();
    expect(shell.test('-f', 'myProject/.lintstagedrc.json')).toBeTruthy();
    expect(shell.test('-f', 'myProject/.prettierrc.json')).toBeTruthy();
    expect(shell.test('-f', 'myProject/.stylelintrc.json')).toBeTruthy();
    expect(output.code).toBe(0);
  });
});
