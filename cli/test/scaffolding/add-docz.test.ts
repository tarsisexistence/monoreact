import * as shell from 'shelljs';
import * as fs from 'fs-extra';
import * as path from 'path';

import { setupStage, teardownStage } from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'scaffolding';
const fixture = 'add-docz';

describe('[bin.scaffolding.add-docz]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  it('should have doczrc.js', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js add docz');
    expect(shell.test('-f', 'doczrc.js')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have bootstrap script in the package.json', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js add docz');
    const packageJson = fs.readJSONSync(path.resolve('package.json'));
    expect(packageJson.scripts).toHaveProperty('start:docz');
    expect(output.code).toBe(0);
  });

  it('should have correct bootstrap script value', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js add docz');
    const packageJson = fs.readJSONSync(path.resolve('package.json'));
    expect(packageJson.scripts['start:docz']).toBe('docz dev -p 6010');
    expect(output.code).toBe(0);
  });
});
