import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'workspaces';
const fixture = 'workspaces-test-default';

describe('[bin.execution.workspaces-test-default]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  it('should test packages with exit 0 when all packages have passed tests', () => {
    const output = smartExec('node ../../../dist/bundle.cjs workspaces test');
    expect(output.code).toBe(0);
  });
});
