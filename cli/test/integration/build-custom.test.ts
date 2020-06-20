import * as shell from 'shelljs';
import { resolve } from 'path';

import { setupStageWithFixture, teardownStage } from '../utils/fixture';
import { execWithCache } from '../utils/shell';

shell.config.silent = false;

const testDir = 'integration';
const fixtureName = 'build-custom';
const stageName = `stage-${fixtureName}`;

describe('[integration.build.custom]', () => {
  beforeAll(() => {
    teardownStage(stageName);
    setupStageWithFixture(testDir, stageName, fixtureName);
  });

  afterAll(() => {
    teardownStage(stageName);
  });

  it('should compile files into a dist directory', () => {
    const output = execWithCache('node ../dist/src/bin/index.js build');
    expect(shell.test('-f', 'dist/output.js')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should compile files with custom entry points', () => {
    const output = execWithCache('node ../dist/src/bin/index.js build');
    expect(shell.test('-f', 'dist/output.js')).toBeTruthy();
    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should not compile files in test/ or types/', () => {
    const output = execWithCache('node ../dist/src/bin/index.js build');
    expect(shell.test('-d', 'dist/test/')).toBeFalsy();
    expect(shell.test('-d', 'dist/types/')).toBeFalsy();
    expect(output.code).toBe(0);
  });

  it('should create the library correctly', () => {
    const output = execWithCache('node ../dist/src/bin/index.js build');
    const lib = require(resolve(process.cwd(), 'dist', 'output.js'));
    expect(lib.foo()).toBe('bar');
    expect(lib.sum(1, 2)).toBe(3);
    expect(output.code).toBe(0);
  });

  it('should clean the dist directory before rebuilding', () => {
    let output = execWithCache('node ../dist/src/bin/index.js build');
    expect(output.code).toBe(0);

    shell.mv('package.json', 'package-copy.json');
    shell.mv('customPackage.json', 'package.json');

    output = execWithCache('node ../dist/src/bin/index.js build', {
      noCache: true
    });

    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();
    expect(shell.test('-f', 'dist/output.js')).toBeFalsy();
    expect(shell.test('-f', 'dist/outputCustom.js')).toBeTruthy();
    expect(output.code).toBe(0);

    shell.mv('package.json', 'customPackage.json');
    shell.mv('package-copy.json', 'package.json');
  });
});
