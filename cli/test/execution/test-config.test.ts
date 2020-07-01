import * as shell from 'shelljs';

import { setupStage, teardownStage } from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'execution';
const fixture = 'test-config';

describe('[bin.execution.test.config]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  it('should test one test in src dir by default', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js test');
    expect(output.code).toBe(0);
  });

  it('should test in src __tests__ dir', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js test --config customJestSrcTests.config.js');
    expect(output.code).toBe(0);
  });

  it('should fail with no found tests in src level dir', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js test --config customJestSrc.config.js');
    expect(output.code).toBe(1);
  });

  it('should finish positive tests in test dir', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js test --config customJestTest.config.js');
    expect(output.code).toBe(0);
  });

  it('should fail with no found tests in __tests__ dir', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js test --config customJestTests.config.js');
    expect(output.code).toBe(0);
  });
});
