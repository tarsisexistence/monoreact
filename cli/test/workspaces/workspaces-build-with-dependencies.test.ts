import * as shell from 'shelljs';

import { setupStage, teardownStage } from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'workspaces';
const fixtureName = 'workspaces-build-with-dependencies';

describe('[bin.execution.workspaces-build-with-dependencies]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName);
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should compile packages', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js workspaces build');
    expect(output.code).toBe(0);
  });

  it('should have compiled shared output', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js workspaces build');
    expect(shell.test('-d', 'shared/workspaces-example-1/dist')).toBeTruthy();
    expect(shell.test('-d', 'shared/workspaces-example-2/dist')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have compiled services output', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js workspaces build');
    expect(shell.test('-d', 'services/workspaces-example-3/dist')).toBeTruthy();
    expect(shell.test('-d', 'services/workspaces-example-4/dist')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have compiled components output', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js workspaces build');
    expect(shell.test('-d', 'components/workspaces-example-5/dist')).toBeTruthy();
    expect(shell.test('-d', 'components/workspaces-example-6/dist')).toBeTruthy();
    expect(output.code).toBe(0);
  });
});
