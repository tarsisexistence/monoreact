import * as shell from 'shelljs';

import { setupStage, teardownStage } from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;
const testDir = 'scaffolding';
const fixtureName = 'new-invalid-template';
const template = 'new';

describe('[bin.scaffolding.new-invalid-template]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName, { template });
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  // TODO: provide select with available templates instead exit 1
  it('should fail with exit code 1', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js new myProject --template someInvalidTemplateName');
    expect(output.code).toBe(1);
  });

  it('should not create new project', () => {
    smartExec('node ../../../dist/src/bin/index.js new myProject --template someInvalidTemplateName');
    expect(shell.test('-d', 'myProject')).toBeFalsy();
  });
});
