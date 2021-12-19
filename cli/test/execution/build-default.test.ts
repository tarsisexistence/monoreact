import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'execution';
const fixture = 'build-default';

describe('[bin.execution.build.default]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  it('should compile files into a dist directory', () => {
    const output = smartExec('node ../../../dist/bundle.cjs build');
    expect(shell.test('-d', 'dist')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should compile files into bundle.js', () => {
    const output = smartExec('node ../../../dist/bundle.cjs build');
    expect(shell.test('-f', 'dist/bundle.js')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should compile declaration typescript file for entry point', () => {
    const output = smartExec('node ../../../dist/bundle.cjs build');
    expect(shell.test('-f', 'dist/publicApi.d.ts')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should compile sourcemaps for bundle.js', () => {
    const output = smartExec('node ../../../dist/bundle.cjs build');
    expect(shell.test('-f', 'dist/bundle.js.map')).toBeTruthy();
    expect(output.code).toBe(0);
  });
});
