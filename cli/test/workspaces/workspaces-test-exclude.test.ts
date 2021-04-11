import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'workspaces';
const fixture = 'workspaces-test-exclude';
const template = 'workspaces-test-invalid';

describe('[bin.execution.workspaces-test-exclude]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture, template });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  it('should exclude failed test and exit with 0', () => {
    const output = smartExec(
      'monoreact workspaces test --exclude @workspaces-test-invalid/workspaces-example-2'
    );
    expect(output.code).toBe(0);
  });
});
