import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'execution';
const fixture = 'test-empty';

describe('[bin.execution.test.empty]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  it('should fail with exit code 1', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js test');
    expect(output.code).toBe(1);
  });

  it('should fail with exit code 0 with --passWithNoTests', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js test --passWithNoTests');
    expect(output.code).toBe(0);
  });
});
