import * as shell from 'shelljs';

import {
  setupStage,
  teardownStage
} from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'execution';
const fixtureName = 'build-invalid';

describe('[bin.build.invalid]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName);
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should not compile when build failed', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js build');
    expect(output.code).toBe(1);
  });
});
