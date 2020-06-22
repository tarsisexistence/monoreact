import * as shell from 'shelljs';
import * as fs from 'fs-extra';
import * as path from 'path';

import {
  setupStage,
  teardownStage
} from '../../src/shared/utils/fixture.utils';
import { execWithCache } from '../../src/shared/utils/shell.utils';

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

  it('should install "dependency" in the root', () => {
    const output = execWithCache(
      'node ../dist/src/bin/index.js install @re-space/cli'
    );
    const rootPkg = fs.readJSONSync(
      path.resolve(process.cwd(), 'package.json')
    );

    expect(rootPkg.dependencies).toHaveProperty('@re-space/cli');
    expect(output.code).toBe(0);
  });

  it('should install nothing but "dependency" in the root', () => {
    const output = execWithCache(
      'node ../dist/src/bin/index.js install @re-space/cli'
    );
    const rootPkg = fs.readJSONSync(
      path.resolve(process.cwd(), 'package.json')
    );
    const packagePkg = fs.readJSONSync(
      path.resolve(process.cwd(), 'packages', 'install-example', 'package.json')
    );

    expect(rootPkg.devDependencies).not.toHaveProperty('@re-space/cli');
    expect(rootPkg.peerDependencies).not.toHaveProperty('@re-space/cli');
    expect(packagePkg.dependencies).not.toHaveProperty('@re-space/cli');
    expect(packagePkg.devDependencies).not.toHaveProperty('@re-space/cli');
    expect(packagePkg.peerDependencies).not.toHaveProperty('@re-space/cli');
    expect(output.code).toBe(0);
  });

  it('should install only one devDependency in the root', () => {
    const output = execWithCache(
      'node ../dist/src/bin/index.js install @re-space/cli -D'
    );
    const rootPkg = fs.readJSONSync(
      path.resolve(process.cwd(), 'package.json')
    );
    expect(rootPkg.devDependencies).toHaveProperty('@re-space/cli');
    expect(output.code).toBe(0);
  });

  it('should install nothing but "devDependency" in the root', () => {
    const output = execWithCache(
      'node ../dist/src/bin/index.js install @re-space/cli -D'
    );
    const rootPkg = fs.readJSONSync(
      path.resolve(process.cwd(), 'package.json')
    );
    const packagePkg = fs.readJSONSync(
      path.resolve(process.cwd(), 'packages', 'install-example', 'package.json')
    );
    expect(rootPkg.dependencies).not.toHaveProperty('@re-space/cli');
    expect(rootPkg.peerDependencies).not.toHaveProperty('@re-space/cli');
    expect(packagePkg.dependencies).not.toHaveProperty('@re-space/cli');
    expect(packagePkg.devDependencies).not.toHaveProperty('@re-space/cli');
    expect(packagePkg.peerDependencies).not.toHaveProperty('@re-space/cli');
    expect(output.code).toBe(0);
  });
});
