import * as shell from 'shelljs';
import * as fs from 'fs-extra';
import * as path from 'path';

import {
  setupStage,
  teardownStage
} from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'app';
const fixtureName = 'app-install';

describe('[bin.app.install]', () => {
  const emptyDependencies = {
    dependencies: {},
    devDependencies: {},
    peerDependencies: {}
  };

  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName);
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  afterEach(() => {
    const rootPkgPath = path.resolve(process.cwd(), 'package.json');
    const rootPkg = fs.readJSONSync(rootPkgPath);
    const packagePkgPath = path.resolve(
      process.cwd(),
      'packages',
      'install-example',
      'package.json'
    );
    const packagePkg = fs.readJSONSync(packagePkgPath);

    fs.writeFileSync(
      rootPkgPath,
      JSON.stringify({ ...rootPkg, ...emptyDependencies })
    );
    fs.writeFileSync(
      packagePkgPath,
      JSON.stringify({ ...packagePkg, ...emptyDependencies })
    );
  });

  it('should install few prod dependencies in the root', () => {
    const output = smartExec(
      'node ../dist/src/bin/index.js install @re-space/cli routeshub'
    );
    const rootPkg = fs.readJSONSync(
      path.resolve(process.cwd(), 'package.json')
    );

    expect(rootPkg.dependencies).toHaveProperty('@re-space/cli');
    expect(rootPkg.dependencies).toHaveProperty('routeshub');
    expect(output.code).toBe(0);
  });

  it('should install nothing but prod dependencies in the root', () => {
    const output = smartExec(
      'node ../dist/src/bin/index.js install @re-space/cli routeshub'
    );
    const rootPkg = fs.readJSONSync(
      path.resolve(process.cwd(), 'package.json')
    );
    const packagePkg = fs.readJSONSync(
      path.resolve(process.cwd(), 'packages', 'install-example', 'package.json')
    );
    Object.keys({
      ...rootPkg.devDependencies,
      ...rootPkg.peerDependencies,
      ...packagePkg.dependencies,
      ...packagePkg.devDependencies,
      ...packagePkg.peerDependencies
    }).forEach(dep => {
      expect(dep).not.toBe('@re-space/cli');
      expect(dep).not.toBe('routeshub');
    });
    expect(output.code).toBe(0);
  });

  it('should install only dev dependencies in the root', () => {
    const output = smartExec(
      'node ../dist/src/bin/index.js install @re-space/cli routeshub -D'
    );
    const rootPkg = fs.readJSONSync(
      path.resolve(process.cwd(), 'package.json')
    );
    expect(rootPkg.devDependencies).toHaveProperty('@re-space/cli');
    expect(rootPkg.devDependencies).toHaveProperty('routeshub');
    expect(output.code).toBe(0);
  });

  it('should install nothing but dev dependencies in the root', () => {
    const output = smartExec(
      'node ../dist/src/bin/index.js install @re-space/cli routeshub -D'
    );
    const rootPkg = fs.readJSONSync(
      path.resolve(process.cwd(), 'package.json')
    );
    const packagePkg = fs.readJSONSync(
      path.resolve(process.cwd(), 'packages', 'install-example', 'package.json')
    );

    Object.keys({
      ...rootPkg.dependencies,
      ...rootPkg.peerDependencies,
      ...packagePkg.dependencies,
      ...packagePkg.devDependencies,
      ...packagePkg.peerDependencies
    }).forEach(dep => {
      expect(dep).not.toBe('@re-space/cli');
      expect(dep).not.toBe('routeshub');
    });
    expect(output.code).toBe(0);
  });

  it('should install peer dependencies in the package and prod in the root', () => {
    const cwd = process.cwd();
    const packageDir = path.resolve(cwd, 'packages', 'install-example');
    process.chdir(packageDir);
    const output = smartExec(
      'node ../../../dist/src/bin/index.js install @re-space/cli routeshub'
    );
    process.chdir(cwd);
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
    process.chdir(packageDir);
    const output = smartExec(
      'node ../../../dist/src/bin/index.js install @re-space/cli routeshub'
    );
    process.chdir(cwd);
    const rootPkg = fs.readJSONSync(path.resolve(cwd, 'package.json'));
    const packagePkg = fs.readJSONSync(
      path.resolve(packageDir, 'package.json')
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

  it('should install dev dependencies for package and root', () => {
    const cwd = process.cwd();
    const packageDir = path.resolve(cwd, 'packages', 'install-example');
    process.chdir(packageDir);
    const output = smartExec(
      'node ../../../dist/src/bin/index.js install @re-space/cli routeshub -D'
    );
    process.chdir(cwd);
    const rootPkg = fs.readJSONSync(path.resolve(cwd, 'package.json'));
    const packagePkg = fs.readJSONSync(
      path.resolve(packageDir, 'package.json')
    );

    expect(rootPkg.devDependencies).toHaveProperty('@re-space/cli');
    expect(rootPkg.devDependencies).toHaveProperty('routeshub');
    expect(packagePkg.devDependencies).toHaveProperty('@re-space/cli');
    expect(packagePkg.devDependencies).toHaveProperty('routeshub');
    expect(output.code).toBe(0);
  });

  it('should install nothing but dev dependencies for package and root', () => {
    const cwd = process.cwd();
    const packageDir = path.resolve(cwd, 'packages', 'install-example');
    process.chdir(packageDir);
    const output = smartExec(
      'node ../../../dist/src/bin/index.js install @re-space/cli routeshub -D'
    );
    process.chdir(cwd);
    const rootPkg = fs.readJSONSync(path.resolve(cwd, 'package.json'));
    const packagePkg = fs.readJSONSync(
      path.resolve(packageDir, 'package.json')
    );

    Object.keys({
      ...rootPkg.dependencies,
      ...rootPkg.peerDependencies,
      ...packagePkg.dependencies,
      ...packagePkg.peerDependencies
    }).forEach(dep => {
      expect(dep).not.toBe('@re-space/cli');
      expect(dep).not.toBe('routeshub');
    });
    expect(output.code).toBe(0);
  });

  it('should not have tilde and caret (~, ^) in the root', () => {
    const output = smartExec(
      'node ../dist/src/bin/index.js install routeshub'
    );
    const rootPkg = fs.readJSONSync(
      path.resolve(process.cwd(), 'package.json')
    );

    expect(rootPkg.dependencies.routeshub[0]).not.toBe('^');
    expect(rootPkg.dependencies.routeshub[0]).not.toBe('~');
    expect(output.code).toBe(0);
  });

  it('should have caret (^) in the package', () => {
    const cwd = process.cwd();
    const packageDir = path.resolve(cwd, 'packages', 'install-example');
    process.chdir(packageDir);
    const output = smartExec(
      'node ../../../dist/src/bin/index.js install routeshub'
    );
    process.chdir(cwd);
    const packagePkg = fs.readJSONSync(
      path.resolve(packageDir, 'package.json')
    );

    expect(packagePkg.peerDependencies.routeshub[0]).toBe('^');
    expect(packagePkg.peerDependencies.routeshub[0]).not.toBe('~');
    expect(output.code).toBe(0);
  });
});
