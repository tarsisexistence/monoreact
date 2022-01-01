import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';
import { getJsonByRelativePath } from '../utils';

shell.config.silent = false;

const testDir = 'scaffolding';
const fixture = 'generate-custom-location';

describe('[bin.scaffolding.generate-custom-location]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  const run = () => smartExec('node ../../../dist/bundle.cjs generate myPackage --template basic');

  it('should have not default packages location', () => {
    const output = run();
    expect(shell.test('-d', 'workspace-packages/myPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should update workspaces declaration', () => {
    const output = run();
    const rootPackageJson = getJsonByRelativePath('package.json');
    expect(rootPackageJson.workspaces).toContain('workspace-packages/myPackage');
    expect(output.code).toBe(0);
  });
});
