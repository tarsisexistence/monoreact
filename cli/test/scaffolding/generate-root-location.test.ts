import * as shell from 'shelljs';
import * as path from 'path';
import * as fs from 'fs-extra';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'scaffolding';
const fixture = 'generate-root-location';

describe('[bin.scaffolding.generate-root-location]', () => {
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

  it('should update workspaces declaration', () => {
    const output = run();
    const rootPackageJson = fs.readJSONSync(path.resolve(process.cwd(), 'package.json'));
    expect(rootPackageJson.workspaces).toContain('myPackage');
    expect(output.code).toBe(0);
  });
});
