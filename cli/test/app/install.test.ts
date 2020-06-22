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
  let stagingCwd = '';
  let rootPkgPath = '';
  let packagePkgPath = '';
  let rootPkg = {};
  let packagePkg = {};

  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName);
    stagingCwd = process.cwd();
    rootPkgPath = path.resolve(stagingCwd, 'package.json');
    packagePkgPath = path.resolve(
      stagingCwd,
      'packages',
      'install-example',
      'package.json'
    );
    rootPkg = fs.readJSONSync(rootPkgPath);
    packagePkg = fs.readJSONSync(packagePkgPath);
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  /**
   * @reminder: call this fn into all next-level describe chunks that grouped by exec commands
   *
   * this "hack" increases the speed of test running
   * because each test mutates our single stage for "install" testing
   * and we don't want to build the stage for each test because it's very expensive
   * the decision is using exec caching for grouped describe-chunk by exec command
   * when describe-chunk has finished its job, this function restores the original state of the stage
   */
  const addAfter = () => {
    afterAll(() => {
      fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg));
      fs.writeFileSync(packagePkgPath, JSON.stringify(packagePkg));
    });
  };

  describe('when run in root: install @re-space/cli routeshub', () => {
    addAfter();

    it('should install few prod dependencies in the root', () => {
      const output = smartExec(
        'node ../../../dist/src/bin/index.js install @re-space/cli routeshub'
      );
      const rootPkg = fs.readJSONSync(rootPkgPath);
      expect(rootPkg.dependencies).toHaveProperty('@re-space/cli');
      expect(rootPkg.dependencies).toHaveProperty('routeshub');
      expect(output.code).toBe(0);
    });

    it('should install nothing but prod dependencies in the root', () => {
      const output = smartExec(
        'node ../../../dist/src/bin/index.js install @re-space/cli routeshub'
      );
      const rootPkg = fs.readJSONSync(rootPkgPath);
      const packagePkg = fs.readJSONSync(packagePkgPath);
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

    it('should not have tilde and caret (~, ^) in the root', () => {
      const output = smartExec(
        'node ../../../dist/src/bin/index.js install @re-space/cli routeshub'
      );
      const rootPkg = fs.readJSONSync(rootPkgPath);
      expect(rootPkg.dependencies.routeshub[0]).not.toBe('^');
      expect(rootPkg.dependencies.routeshub[0]).not.toBe('~');
      expect(rootPkg.dependencies['@re-space/cli'][0]).not.toBe('^');
      expect(rootPkg.dependencies['@re-space/cli'][0]).not.toBe('~');
      expect(output.code).toBe(0);
    });
  });

  describe('when run in root: install @re-space/cli routeshub -D', () => {
    addAfter();

    it('should install only dev dependencies in the root', () => {
      const output = smartExec(
        'node ../../../dist/src/bin/index.js install @re-space/cli routeshub -D'
      );
      const rootPkg = fs.readJSONSync(rootPkgPath);
      expect(rootPkg.devDependencies).toHaveProperty('@re-space/cli');
      expect(rootPkg.devDependencies).toHaveProperty('routeshub');
      expect(output.code).toBe(0);
    });

    it('should install nothing but dev dependencies in the root', () => {
      const output = smartExec(
        'node ../../../dist/src/bin/index.js install @re-space/cli routeshub -D'
      );
      const rootPkg = fs.readJSONSync(rootPkgPath);
      const packagePkg = fs.readJSONSync(packagePkgPath);
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
  });

  describe('when run in package: install @re-space/cli routeshub', () => {
    addAfter();

    it('should install peer dependencies in the package and prod in the root', () => {
      const packageDir = path.resolve(
        stagingCwd,
        'packages',
        'install-example'
      );
      shell.cd(packageDir);
      const output = smartExec(
        'node ../../../../../dist/src/bin/index.js install @re-space/cli routeshub'
      );
      shell.cd(stagingCwd);
      const rootPkg = fs.readJSONSync(rootPkgPath);
      const packagePkg = fs.readJSONSync(packagePkgPath);

      expect(rootPkg.dependencies).toHaveProperty('@re-space/cli');
      expect(rootPkg.dependencies).toHaveProperty('routeshub');
      expect(packagePkg.peerDependencies).toHaveProperty('@re-space/cli');
      expect(packagePkg.peerDependencies).toHaveProperty('routeshub');
      expect(output.code).toBe(0);
    });

    it('should install nothing but peer dependencies in the package and prod in the root', () => {
      const packageDir = path.resolve(
        stagingCwd,
        'packages',
        'install-example'
      );
      shell.cd(packageDir);
      const output = smartExec(
        'node ../../../../../dist/src/bin/index.js install @re-space/cli routeshub'
      );
      shell.cd(stagingCwd);
      const rootPkg = fs.readJSONSync(rootPkgPath);
      const packagePkg = fs.readJSONSync(packagePkgPath);

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
      const packageDir = path.resolve(
        stagingCwd,
        'packages',
        'install-example'
      );
      shell.cd(packageDir);
      const output = smartExec(
        'node ../../../../../dist/src/bin/index.js install @re-space/cli routeshub'
      );
      shell.cd(stagingCwd);
      const packagePkg = fs.readJSONSync(packagePkgPath);

      expect(packagePkg.peerDependencies.routeshub[0]).toBe('^');
      expect(packagePkg.peerDependencies.routeshub[0]).not.toBe('~');
      expect(packagePkg.peerDependencies['@re-space/cli'][0]).toBe('^');
      expect(packagePkg.peerDependencies['@re-space/cli'][0]).not.toBe('~');
      expect(output.code).toBe(0);
    });
  });

  describe('when run in package: install @re-space/cli routeshub -D', () => {
    addAfter();

    it('should install dev dependencies for package and root', () => {
      const packageDir = path.resolve(
        stagingCwd,
        'packages',
        'install-example'
      );
      shell.cd(packageDir);
      const output = smartExec(
        'node ../../../../../dist/src/bin/index.js install @re-space/cli routeshub -D'
      );
      shell.cd(stagingCwd);
      const rootPkg = fs.readJSONSync(rootPkgPath);
      const packagePkg = fs.readJSONSync(packagePkgPath);
      expect(rootPkg.devDependencies).toHaveProperty('@re-space/cli');
      expect(rootPkg.devDependencies).toHaveProperty('routeshub');
      expect(packagePkg.devDependencies).toHaveProperty('@re-space/cli');
      expect(packagePkg.devDependencies).toHaveProperty('routeshub');
      expect(output.code).toBe(0);
    });

    it('should install nothing but dev dependencies for package and root', () => {
      const packageDir = path.resolve(
        stagingCwd,
        'packages',
        'install-example'
      );
      shell.cd(packageDir);
      const output = smartExec(
        'node ../../../../../dist/src/bin/index.js install @re-space/cli routeshub -D'
      );
      shell.cd(stagingCwd);
      const rootPkg = fs.readJSONSync(rootPkgPath);
      const packagePkg = fs.readJSONSync(packagePkgPath);

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
  });
});
