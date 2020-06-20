import * as shell from 'shelljs';

import * as util from '../utils/fixture';
import { execWithCache } from '../utils/shell';

shell.config.silent = false;

const testDir = 'build';
const fixtureName = 'build-invalid';

describe('[bin.build.invalid]', () => {
  beforeAll(() => {
    util.teardownStage(fixtureName);
    util.setupStage(testDir, fixtureName);
  });

  afterAll(() => {
    util.teardownStage(fixtureName);
  });

  it('should not compile with exit code 1 when build failed', () => {
    const output = execWithCache('node ../dist/src/bin/index.js build');
    expect(output.code).toBe(1);
  });
});
