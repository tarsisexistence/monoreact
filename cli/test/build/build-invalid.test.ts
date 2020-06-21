import * as shell from 'shelljs';

import {
  setupStage,
  teardownStage
} from '../../src/shared/utils/fixture.utils';
import { execWithCache } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'build';
const fixtureName = 'build-invalid';

describe('[bin.build.invalid]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName);
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should not compile with exit code 1 when build failed', () => {
    const output = execWithCache('node ../dist/src/bin/index.js build');
    expect(output.code).toBe(1);
  });
});
