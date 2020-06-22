import * as shell from 'shelljs';

import {
  setupStage,
  teardownStage
} from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'test';
const fixtureName = 'test-invalid';

describe('[bin.test.invalid]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName);
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should fail tests with exit code 1', () => {
    const output = smartExec('node ../dist/src/bin/index.js test');
    expect(output.code).toBe(1);
  });

  it('should fail tests because of type system', () => {
    const output = smartExec(
      'node ../dist/src/bin/index.js test type-input'
    );
    expect(output.code).toBe(1);
  });

  it('should fail tests because of result type', () => {
    const output = smartExec(
      'node ../dist/src/bin/index.js test type-result'
    );
    expect(output.code).toBe(1);
  });

  it('should fail tests because of wrong result', () => {
    const output = smartExec('node ../dist/src/bin/index.js test wrong');
    expect(output.code).toBe(1);
  });

  it('should not have invalid tests when use pattern of only valid tests', () => {
    const output = smartExec('node ../dist/src/bin/index.js test correct');
    expect(output.code).toBe(0);
  });
});
