import * as shell from 'shelljs';
import * as path from 'path';
import * as fs from 'fs-extra';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'scaffolding';
const fixture = 'generate-wildcard-location';

describe('[bin.scaffolding.generate-wildcard-location]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  const run = () => smartExec('node ../../../dist/bundle.cjs generate myPackage --template basic');

  it('should be generated in the root', () => {
    const output = run();
    expect(shell.test('-d', 'myPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should not update workspaces declaration when wildcard covers that path', () => {
    const output = run();
    const rootPackageJson = fs.readJSONSync(path.resolve('package.json'));
    expect(rootPackageJson.workspaces).not.toContain('myPackage');
    expect(output.code).toBe(0);
  });
});
