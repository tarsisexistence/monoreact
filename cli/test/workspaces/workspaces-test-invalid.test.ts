import * as shell from 'shelljs';

import { setupStage, teardownStage } from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'workspaces';
const fixtureName = 'workspaces-test-invalid';

describe('[bin.execution.workspaces-test-invalid]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName, { install: true });
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should test packages with exit 1 when one of the packages has failed tests', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js workspaces test');
    expect(output.code).toBe(1);
  });
});
