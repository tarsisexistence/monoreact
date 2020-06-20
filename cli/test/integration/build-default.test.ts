import * as shell from 'shelljs';

import { setupStageWithFixture, teardownStage } from '../utils/fixture';
import { execWithCache } from '../utils/shell';

shell.config.silent = false;

const testDir = 'integration';
const fixtureName = 'build-default';
const stageName = `stage-integration-${fixtureName}`;

describe('[integration.build.default]', () => {
  beforeAll(() => {
    teardownStage(stageName);
    setupStageWithFixture(testDir, stageName, fixtureName);
  });

  afterAll(() => {
    teardownStage(stageName);
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
