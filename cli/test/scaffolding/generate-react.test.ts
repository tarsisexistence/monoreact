import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';
import { getJsonByRelativePath } from '../utils';

shell.config.silent = false;

const testDir = 'scaffolding';
const fixture = 'generate-react';
const template = 'generate';

describe('[bin.scaffolding.generate-react]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture, template });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  const run = () => smartExec('node ../../../dist/bundle.cjs generate myReactPackage --template react');

  it('should generate package dir', () => {
    const output = run();
    expect(shell.test('-d', 'packages/myReactPackage')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have build of react package', () => {
    const output = run();
    expect(shell.test('-d', 'packages/myReactPackage/dist')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have example tsx component', () => {
    const output = run();
    expect(shell.test('-f', 'packages/myReactPackage/src/Component.tsx')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have react as peer dependency', () => {
    const output = run();
    const packageJson = getJsonByRelativePath('packages', 'myReactPackage', 'package.json');
    expect(packageJson.peerDependencies).toHaveProperty('react');
    expect(output.code).toBe(0);
  });

  it('should not have other default dependencies', () => {
    const output = run();
    const packageJson = getJsonByRelativePath('packages', 'myReactPackage', 'package.json');
    const peerDepsWithoutReact = Object.keys(packageJson.peerDependencies).filter(dep => dep !== 'react');
    expect(peerDepsWithoutReact.length).toBe(0);
    expect(packageJson).not.toHaveProperty('dependencies');
    expect(packageJson).not.toHaveProperty('devDependencies');
    expect(output.code).toBe(0);
  });
});
