import * as shell from 'shelljs';

import { setupStage, teardownStage } from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'execution';
const fixture = 'build-invalid';

describe('[bin.execution.build.invalid]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  it('should not compile when build failed', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js build');
    expect(output.code).toBe(1);
  });
});
