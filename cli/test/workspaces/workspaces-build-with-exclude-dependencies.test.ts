import * as shell from 'shelljs';

import { setupStage, teardownStage } from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'workspaces';
const fixtureName = 'workspaces-build-with-exclude-dependencies';
const template = 'workspaces-build-with-dependencies';

describe('[bin.execution.workspaces-build-with-exclude-dependencies]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName, { template, install: true });
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should compile packages as usual', () => {
    const output = smartExec(
      'node ../../../dist/src/bin/index.js workspaces build --exclude @workspaces-build-with-dependencies/workspaces-example-5,@workspaces-build-with-dependencies/workspaces-example-6'
    );
    expect(shell.test('-d', 'shared/workspaces-example-1/dist')).toBeTruthy();
    expect(shell.test('-d', 'shared/workspaces-example-2/dist')).toBeTruthy();
    expect(shell.test('-d', 'services/workspaces-example-3/dist')).toBeTruthy();
    expect(shell.test('-d', 'services/workspaces-example-4/dist')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should not compile excluded packages', () => {
    const output = smartExec(
      'node ../../../dist/src/bin/index.js workspaces build --exclude @workspaces-build-with-dependencies/workspaces-example-5,@workspaces-build-with-dependencies/workspaces-example-6'
    );
    expect(shell.test('-d', 'components/workspaces-example-5/dist')).toBeFalsy();
    expect(shell.test('-d', 'components/workspaces-example-6/dist')).toBeFalsy();
    expect(output.code).toBe(0);
  });
});
