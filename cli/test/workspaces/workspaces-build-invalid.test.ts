import * as shell from 'shelljs';

import { setupStage, teardownStage } from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'workspaces';
const fixtureName = 'workspaces-build-invalid';

describe('[bin.execution.workspaces-build-invalid]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName);
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should not compile packages', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js workspaces build');
    expect(output.code).toBe(1);
  });

  it('should have compiled shared output', () => {
    smartExec('node ../../../dist/src/bin/index.js workspaces build');
    expect(shell.test('-d', 'shared/workspaces-example-1/dist')).toBeTruthy();
    expect(shell.test('-d', 'shared/workspaces-example-2/dist')).toBeTruthy();
  });


  it('should not compile failed build in services', () => {
    smartExec('node ../../../dist/src/bin/index.js workspaces build');
    expect(shell.test('-d', 'services/workspaces-example-4/dist')).toBeFalsy();
  });

  it('should not compile dependent packages on the failed one', () => {
    smartExec('node ../../../dist/src/bin/index.js workspaces build');
    expect(shell.test('-d', 'components/workspaces-example-5/dist')).toBeFalsy();
    expect(shell.test('-d', 'components/workspaces-example-6/dist')).toBeFalsy();
  });
});
