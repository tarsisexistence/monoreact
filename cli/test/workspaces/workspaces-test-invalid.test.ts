import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'workspaces';
const fixture = 'workspaces-test-invalid';

describe('[bin.execution.workspaces-test-invalid]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  it('should test packages with exit 1 when one of the packages has failed tests', () => {
    const output = smartExec('monoreact workspaces test');
    expect(output.code).toBe(1);
  });
});
