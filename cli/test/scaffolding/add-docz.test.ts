import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';
import { getJsonByRelativePath } from '../utils';

shell.config.silent = false;

const testDir = 'scaffolding';
const fixture = 'add-docz';
const template = 'add';

describe('[bin.scaffolding.add-docz]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture, template });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  const run = () => smartExec('node ../../../dist/bundle.cjs add docz');

  it('should have doczrc.js', () => {
    const output = run();
    expect(shell.test('-f', 'doczrc.js')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have bootstrap script in the package.json', () => {
    const output = run();
    const packageJson = getJsonByRelativePath('./package.json');
    expect(packageJson.scripts).toHaveProperty('start:docz');
    expect(output.code).toBe(0);
  });

  it('should have correct bootstrap script value', () => {
    const output = run();
    const packageJson = getJsonByRelativePath('./package.json');
    expect(packageJson.scripts['start:docz']).toBe('docz dev -p 6010');
    expect(output.code).toBe(0);
  });
});
