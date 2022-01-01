import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'workspaces';
const fixture = 'workspaces-build-with-exclude-dependencies';
const template = 'workspaces-build-with-dependencies';

describe('[bin.execution.workspaces-build-with-exclude-dependencies]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture, template });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  const run = () =>
    smartExec(
      'node ../../../dist/bundle.cjs workspaces build --exclude @workspaces-build-with-dependencies/workspaces-example-5,@workspaces-build-with-dependencies/workspaces-example-6'
    );

  it('should compile packages as usual', () => {
    const output = run();
    expect(shell.test('-d', 'shared/workspaces-example-1/dist')).toBeTruthy();
    expect(shell.test('-d', 'shared/workspaces-example-2/dist')).toBeTruthy();
    expect(shell.test('-d', 'services/workspaces-example-3/dist')).toBeTruthy();
    expect(shell.test('-d', 'services/workspaces-example-4/dist')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should not compile excluded packages', () => {
    const output = run();
    expect(shell.test('-d', 'components/workspaces-example-5/dist')).toBeFalsy();
    expect(shell.test('-d', 'components/workspaces-example-6/dist')).toBeFalsy();
    expect(output.code).toBe(0);
  });
});
