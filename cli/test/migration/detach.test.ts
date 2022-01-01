import * as shell from 'shelljs';
import * as path from 'path';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'migration';
const fixture = 'detach';

describe('[bin.migration.detach]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  const run = () => smartExec('node ../../../dist/bundle.cjs migration detach');

  it('should have .huskyrc.json', () => {
    const output = run();
    expect(shell.test('-f', '.huskyrc.json')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have .lintstagedrc.json', () => {
    const output = run();
    expect(shell.test('-f', '.lintstagedrc.json')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have .prettierrc.json', () => {
    const output = run();
    expect(shell.test('-f', '.prettierrc.json')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should not have extends property inside .eslintrc.js', async () => {
    const output = run();
    const eslintConfig = await import(path.resolve(process.cwd(), '.eslintrc.js'));
    expect(eslintConfig).not.toHaveProperty('extends');
    expect(output.code).toBe(0);
  });
});
