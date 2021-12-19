import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'execution';
const fixture = 'build-jsx';

describe('[bin.execution.build.jsx]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  it('should compile files into a dist directory', () => {
    const output = smartExec('node ../../../dist/bundle.cjs build');
    expect(shell.test('-d', 'dist')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should compile files into bundle.js', () => {
    const output = smartExec('node ../../../dist/bundle.cjs build');
    expect(shell.test('-f', 'dist/bundle.js')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should compile declaration typescript files for js/jsx/ts/tsx', () => {
    const output = smartExec('node ../../../dist/bundle.cjs build');

    expect(shell.test('-f', 'dist/publicApi.d.ts')).toBeTruthy();
    expect(shell.test('-f', 'dist/utils/capitalize.d.ts')).toBeTruthy();
    expect(shell.test('-f', 'dist/utils/noop.d.ts')).toBeTruthy();
    expect(shell.test('-f', 'dist/utils/products.d.ts')).toBeTruthy();
    expect(shell.test('-f', 'dist/components/BuyButton.d.ts')).toBeTruthy();
    expect(shell.test('-f', 'dist/components/Products.d.ts')).toBeTruthy();

    expect(output.code).toBe(0);
  });

  it('should compile sourcemaps for bundle.js', () => {
    const output = smartExec('node ../../../dist/bundle.cjs build');
    expect(shell.test('-f', 'dist/bundle.js.map')).toBeTruthy();
    expect(output.code).toBe(0);
  });
});
