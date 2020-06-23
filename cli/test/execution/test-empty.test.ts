import * as shell from 'shelljs';

import {
  setupStage,
  teardownStage
} from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'execution';
const fixtureName = 'test-empty';

describe('[bin.test.empty]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName);
  });

  afterAll(() => {
    teardownStage(fixtureName);
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
