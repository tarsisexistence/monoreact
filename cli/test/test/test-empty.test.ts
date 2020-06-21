import * as shell from 'shelljs';

import {
  setupStage,
  teardownStage
} from '../../src/shared/utils/fixture.utils';
import { execWithCache } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'test';
const fixtureName = 'test-empty';

describe('[bin.test.empty]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName);
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should finish with exit code 1', () => {
    const output = execWithCache('node ../dist/src/bin/index.js test');
    expect(output.code).toBe(1);
  });

  it('should finish with exit code 0 with --passWithNoTests', () => {
    const output = execWithCache('node ../dist/src/bin/index.js test --passWithNoTests');
    expect(output.code).toBe(0);
  });
});
