import * as shell from 'shelljs';

import { setupStage, teardownStage } from '../../src/shared/utils/fixture.utils';
import { execWithCache } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'build';
const fixtureName = 'build-default';

describe('[bin.build.default]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName);
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should compile files into a dist directory', () => {
    const output = execWithCache('node ../dist/src/bin/index.js build');
    expect(shell.test('-d', 'dist')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should compile files into bundle.js', () => {
    const output = execWithCache('node ../dist/src/bin/index.js build');
    expect(shell.test('-f', 'dist/bundle.js')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should compile declaration typescripts file for entry point', () => {
    const output = execWithCache('node ../dist/src/bin/index.js build');
    expect(shell.test('-f', 'dist/publicApi.d.ts')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should compile sourcemaps for bundle.js', () => {
    const output = execWithCache('node ../dist/src/bin/index.js build');
    expect(shell.test('-f', 'dist/bundle.js.map')).toBeTruthy();
    expect(output.code).toBe(0);
  });
});
