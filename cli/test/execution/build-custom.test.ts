import * as shell from 'shelljs';
import * as path from 'path';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'execution';
const fixture = 'build-custom';

describe('[bin.execution.build.custom]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  const run = () => smartExec('node ../../../dist/bundle.cjs build');

  it('should compile files into a dist directory', () => {
    const output = run();
    expect(shell.test('-f', 'dist/output.js')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should compile files with custom entry points', () => {
    const output = run();
    expect(shell.test('-f', 'dist/output.js')).toBeTruthy();
    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should not compile files in test/ or types/', () => {
    const output = run();
    expect(shell.test('-d', 'dist/test/')).toBeFalsy();
    expect(shell.test('-d', 'dist/types/')).toBeFalsy();
    expect(output.code).toBe(0);
  });

  it('should create the library correctly', async () => {
    const output = run();
    const lib = await import(path.resolve('dist', 'output.js'));
    expect(lib.foo()).toBe('bar');
    expect(lib.sum(1, 2)).toBe(3);
    expect(output.code).toBe(0);
  });

  it('should clean the dist directory before rebuilding', () => {
    let output = run();
    expect(output.code).toBe(0);

    shell.mv('package.json', 'package-copy.json');
    shell.mv('customPackage.json', 'package.json');

    output = smartExec('node ../../../dist/bundle.cjs build', {
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
