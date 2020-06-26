import * as shell from 'shelljs';

import { setupStage, teardownStage } from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';
import { installDependencies } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'workspaces';
const fixtureName = 'workspaces-build-with-exclude-dependencies';
const template = 'workspaces-build-with-dependencies';

describe('[bin.execution.workspaces-build-with-exclude-dependencies]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName, template);
    installDependencies();
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should fail with exit 1 if at least one package dependent on excluded one', () => {
    // the error can not be flushed if the dependent package has only package.json dependency and no real usage of the excluded package
    const output = smartExec(
      'node ../../../dist/src/bin/index.js workspaces build --exclude @workspaces-build-with-dependencies/workspaces-example-3'
    );
    expect(output.code).toBe(1);
  });
});
