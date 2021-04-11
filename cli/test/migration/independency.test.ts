import * as shell from 'shelljs';
import * as path from 'path';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'migration';
const fixture = 'independency';

describe('[bin.migration.independency]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  it('should have .huskyrc.json', () => {
    const output = smartExec('monoreact migration independency');
    expect(shell.test('-f', '.huskyrc.json')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have .lintstagedrc.json', () => {
    const output = smartExec('monoreact migration independency');
    expect(shell.test('-f', '.lintstagedrc.json')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have .prettierrc.json', () => {
    const output = smartExec('monoreact migration independency');
    expect(shell.test('-f', '.prettierrc.json')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have .prettierrc.json', () => {
    const output = smartExec('monoreact migration independency');
    expect(shell.test('-f', '.prettierrc.json')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should not have extends property inside .eslintrc.js', () => {
    const output = smartExec('monoreact migration independency');
    const eslintConfig = require(path.resolve('.eslintrc.js'));
    expect(eslintConfig).not.toHaveProperty('extends');
    expect(output.code).toBe(0);
  });
});
