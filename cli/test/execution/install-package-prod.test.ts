import * as shell from 'shelljs';
import * as fs from 'fs-extra';
import * as path from 'path';

import {
  setupStage,
  teardownStage
} from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'execution';
const fixtureName = 'install-package-prod';
const template = 'install';

describe('[bin.execution.install.package.prod]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName, template);
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should install peer dependencies in the package and prod in the root', () => {
    const cwd = process.cwd();
    const packageDir = path.resolve(cwd, 'packages', 'install-example');
    shell.cd(packageDir);
    const output = smartExec(
      'node ../../../../../dist/src/bin/index.js install @re-space/cli routeshub'
    );
    shell.cd(cwd);
    const rootPkg = fs.readJSONSync(path.resolve(cwd, 'package.json'));
    const packagePkg = fs.readJSONSync(
      path.resolve(packageDir, 'package.json')
    );

    expect(rootPkg.dependencies).toHaveProperty('@re-space/cli');
    expect(rootPkg.dependencies).toHaveProperty('routeshub');
    expect(packagePkg.peerDependencies).toHaveProperty('@re-space/cli');
    expect(packagePkg.peerDependencies).toHaveProperty('routeshub');
    expect(output.code).toBe(0);
  });

  it('should install nothing but peer dependencies in the package and prod in the root', () => {
    const cwd = process.cwd();
    const packageDir = path.resolve(cwd, 'packages', 'install-example');
    shell.cd(packageDir);
    const output = smartExec(
      'node ../../../../../dist/src/bin/index.js install @re-space/cli routeshub'
    );
    shell.cd(cwd);
    const rootPkg = fs.readJSONSync(path.resolve(cwd, 'package.json'));
    const packagePkg = fs.readJSONSync(
      path.resolve(cwd, 'packages', 'install-example', 'package.json')
    );
    Object.keys({
      ...rootPkg.devDependencies,
      ...rootPkg.peerDependencies,
      ...packagePkg.dependencies,
      ...packagePkg.devDependencies
    }).forEach(dep => {
      expect(dep).not.toBe('@re-space/cli');
      expect(dep).not.toBe('routeshub');
    });
    expect(output.code).toBe(0);
  });

  it('should have caret (^) in the package', () => {
    const cwd = process.cwd();
    const packageDir = path.resolve(cwd, 'packages', 'install-example');
    shell.cd(packageDir);
    const output = smartExec(
      'node ../../../../../dist/src/bin/index.js install @re-space/cli routeshub'
    );
    shell.cd(cwd);
    const packagePkg = fs.readJSONSync(
      path.resolve(cwd, 'packages', 'install-example', 'package.json')
    );
    expect(packagePkg.peerDependencies.routeshub[0]).toBe('^');
    expect(packagePkg.peerDependencies.routeshub[0]).not.toBe('~');
    expect(packagePkg.peerDependencies['@re-space/cli'][0]).toBe('^');
    expect(packagePkg.peerDependencies['@re-space/cli'][0]).not.toBe('~');
    expect(output.code).toBe(0);
  });
});
