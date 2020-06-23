import * as shell from 'shelljs';

import {
  setupStage,
  teardownStage
} from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'execution';
const fixtureName = 'test-default';

describe('[bin.test.default]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName);
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should finish positive tests', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js test');
    expect(output.code).toBe(0);
  });

  it('should fail, with no found tests with pattern arg and finish with code 1', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js test patternTest');
    expect(output.code).toBe(1);
  });

  it('should not find any test with pattern arg and passWithNoTests option and finish with code 0', () => {
    const output = smartExec(
      'node ../../../dist/src/bin/index.js test patternTest --passWithNoTests'
    );
    expect(output.code).toBe(0);
  });
});
