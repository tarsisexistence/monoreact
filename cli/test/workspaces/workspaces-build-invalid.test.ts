import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'workspaces';
const fixture = 'workspaces-build-invalid';

describe('[bin.execution.workspaces-build-invalid]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  const run = () => smartExec('node ../../../dist/bundle.cjs workspaces build');

  it('should not compile packages', () => {
    const output = run();
    expect(output.code).toBe(1);
  });

  it('should have compiled shared output', () => {
    run();
    expect(shell.test('-d', 'shared/workspaces-example-1/dist')).toBeTruthy();
    expect(shell.test('-d', 'shared/workspaces-example-2/dist')).toBeTruthy();
  });

  it('should not compile failed build in services', () => {
    run();
    expect(shell.test('-d', 'services/workspaces-example-4/dist')).toBeFalsy();
  });

  it('should not compile dependent packages on the failed one', () => {
    run();
    expect(shell.test('-d', 'components/workspaces-example-5/dist')).toBeFalsy();
    expect(shell.test('-d', 'components/workspaces-example-6/dist')).toBeFalsy();
  });
});
