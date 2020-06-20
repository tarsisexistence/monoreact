import * as shell from 'shelljs';

import * as util from '../utils/fixture';
import { execWithCache } from '../utils/shell';

shell.config.silent = false;

const testDir = 'integration';
const fixtureName = 'build-invalid';
const stageName = `stage-${fixtureName}`;

describe('[bin.build.invalid]', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
    util.setupStageWithFixture(testDir, stageName, fixtureName);
  });

  it('should not compile with exit code 1 when build failed', () => {
    const output = execWithCache('node ../dist/src/bin/index.js build');
    expect(output.code).toBe(1);
  });

  afterAll(() => {
    util.teardownStage(stageName);
  });
});
