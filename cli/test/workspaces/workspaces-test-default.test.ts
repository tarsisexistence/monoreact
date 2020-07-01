import * as shell from 'shelljs';

import { setupStage, teardownStage } from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

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
    const output = smartExec('node ../../../dist/src/bin/index.js workspaces test');
    expect(output.code).toBe(0);
  });
});
