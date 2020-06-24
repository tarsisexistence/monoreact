import * as shell from 'shelljs';
import * as path from 'path';

import {
  setupStage,
  teardownStage
} from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'execution';
const fixtureName = 'build-custom';

describe('[bin.execution.build.custom]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName);
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should compile files into a dist directory', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js build');
    expect(shell.test('-f', 'dist/output.js')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should compile files with custom entry points', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js build');
    expect(shell.test('-f', 'dist/output.js')).toBeTruthy();
    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should not compile files in test/ or types/', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js build');
    expect(shell.test('-d', 'dist/test/')).toBeFalsy();
    expect(shell.test('-d', 'dist/types/')).toBeFalsy();
    expect(output.code).toBe(0);
  });

  it('should create the library correctly', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js build');
    const lib = require(path.resolve('dist', 'output.js'));
    expect(lib.foo()).toBe('bar');
    expect(lib.sum(1, 2)).toBe(3);
    expect(output.code).toBe(0);
  });

  it('should clean the dist directory before rebuilding', () => {
    let output = smartExec('node ../../../dist/src/bin/index.js build');
    expect(output.code).toBe(0);

    shell.mv('package.json', 'package-copy.json');
    shell.mv('customPackage.json', 'package.json');

    output = smartExec('node ../../../dist/src/bin/index.js build', {
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
