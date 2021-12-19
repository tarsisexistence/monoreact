import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

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
    const output = smartExec('node ../../../dist/bundle.cjs build');
    expect(output.code).toBe(1);
  });
});
