import * as shell from 'shelljs';
import * as path from 'path';
import * as fs from 'fs-extra';

import {
  setupStage,
  teardownStage
} from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'scaffolding';
const fixtureName = 'generate-root-location';

describe('[bin.scaffolding.generate-root-location]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName);
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should be generated in the root', () => {
    const output = smartExec(
      'node ../../../dist/src/bin/index.js generate myPackage --template basic'
    );
    expect(shell.test('-d', 'myPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should update workspaces declaration', () => {
    const output = smartExec(
      'node ../../../dist/src/bin/index.js generate myPackage --template basic'
    );
    const rootPackageJson = fs.readJSONSync(path.resolve('package.json'));
    expect(rootPackageJson.workspaces).toContain('myPackage');
    expect(output.code).toBe(0);
  });
});
