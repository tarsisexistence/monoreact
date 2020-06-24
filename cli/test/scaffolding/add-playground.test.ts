import * as shell from 'shelljs';
import * as fs from 'fs-extra';
import * as path from 'path';

import {
  setupStage,
  teardownStage
} from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'scaffolding';
const fixtureName = 'add-playground';

describe('[bin.scaffolding.add-playground]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName);
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should have playground folder', () => {
    const output = smartExec(
      'node ../../../dist/src/bin/index.js add playground'
    );
    expect(shell.test('-d', 'playground')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have bootstrap script in the package.json', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js add docz');
    const packageJson = fs.readJSONSync(path.resolve('package.json'));
    expect(packageJson.scripts).toHaveProperty('start:playground');
    expect(output.code).toBe(0);
  });

  it('should have correct bootstrap script value', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js add docz');
    const packageJson = fs.readJSONSync(path.resolve('package.json'));
    expect(packageJson.scripts['start:playground']).toBe(
      'yarn build & npx concurrently --kill-others "yarn start" "cd playground & yarn start"'
    );
    expect(output.code).toBe(0);
  });
});
