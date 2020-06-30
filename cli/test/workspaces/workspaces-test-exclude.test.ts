import * as shell from 'shelljs';

import { setupStage, teardownStage } from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'workspaces';
const fixtureName = 'workspaces-test-exclude';
const template = 'workspaces-test-invalid';

describe('[bin.execution.workspaces-test-exclude]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName, { template, install: true });
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should exclude failed test and exit with 0', () => {
    const output = smartExec(
      'node ../../../dist/src/bin/index.js workspaces test --exclude @workspaces-test-invalid/workspaces-example-2'
    );
    expect(output.code).toBe(0);
  });
});
