import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'workspaces';
const fixture = 'workspaces-build-default';

describe('[bin.execution.workspaces-build-default]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  const run = () => smartExec('node ../../../dist/bundle.cjs workspaces build');

  it('should compile packages', () => {
    const output = run();
    expect(output.code).toBe(0);
  });

  it('should have compiled output', () => {
    const output = run();
    expect(shell.test('-d', 'packages/workspaces-example-1/dist')).toBeTruthy();
    expect(shell.test('-d', 'packages/workspaces-example-2/dist')).toBeTruthy();
    expect(output.code).toBe(0);
  });
});
