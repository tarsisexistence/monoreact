import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'execution';
const fixture = 'test-invalid';

describe('[bin.execution.test.invalid]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  it('should fail tests with exit code 1', () => {
    const output = smartExec('monoreact test');
    expect(output.code).toBe(1);
  });

  it('should fail tests because of type system', () => {
    const output = smartExec('monoreact test type-input');
    expect(output.code).toBe(1);
  });

  it('should fail tests because of result type', () => {
    const output = smartExec('monoreact test type-result');
    expect(output.code).toBe(1);
  });

  it('should fail tests because of wrong result', () => {
    const output = smartExec('monoreact test wrong');
    expect(output.code).toBe(1);
  });

  it('should not have invalid tests when use pattern of only valid tests', () => {
    const output = smartExec('monoreact test correct');
    expect(output.code).toBe(0);
  });
});
