import path from 'path';
import fs from 'fs-extra';
import { exec } from 'shelljs';

import { NotFoundPackageError, NotFoundHostError } from '../models';
import { logError } from './error.utils';
import { PACKAGE_JSON } from '../constants/package.const';

const isHostScope = (pkg: CLI.Package.HostPackageJSON) => pkg.workspaces !== undefined && pkg.private;
const isPackageScope = (pkg: CLI.Package.PackagePackageJSON) => pkg.workspace && !pkg.private;

export const getPackagesFromDeclaration = (workspaces: YarnWorkspaces.Workspaces): YarnWorkspaces.Packages => {
  if (workspaces === undefined) {
    return [];
  }

  if ('packages' in workspaces) {
    return workspaces.packages ?? [];
  }

  return workspaces;
};

export const getNextPackageSetupPath = (packages: YarnWorkspaces.Packages): string => {
  if (packages.length === 0) {
    return 'packages';
  }

  const wildcard = packages.find(pkg => pkg[pkg.length - 1] === '*');

  if (wildcard !== undefined) {
    return wildcard.slice(0, wildcard.length - 2);
  }

  return packages[0].split('/').filter(Boolean).slice(0, -1).join('/');
};

export async function getWorkspaceInfo(): Promise<CLI.Package.PackageInfo[]> {
  const rootDir = await findHostDirectory();
  const yarnWorkspacesJsonInfo = exec('yarn workspaces --json info', {
    cwd: rootDir,
    silent: true
  }).stdout.trim();
  const yarnWorkspaces = JSON.parse(JSON.parse(yarnWorkspacesJsonInfo).data);

  return Object.keys(yarnWorkspaces).reduce(
    (packages: CLI.Package.PackageInfo[], name: string) => [
      ...packages,
      {
        name,
        location: path.resolve(rootDir, yarnWorkspaces[name].location)
      }
    ],
    []
  );
}

export const includePackageIntoDeclaration = ({
  packages,
  packageName,
  setupPath
}: {
  packages: YarnWorkspaces.Packages;
  packageName: string;
  setupPath: string;
}): YarnWorkspaces.Packages => {
  const dir = setupPath
    .split('/')
    .filter(segment => segment !== '.' && segment !== '')
    .join('/');
  const packageWorkspacePath = dir === '' ? packageName : `${dir}/${packageName}`;
  const setupWildcard = dir === '' ? '*' : `${dir}/*`;

  for (const pkg of packages) {
    if (pkg === setupWildcard || pkg === packageWorkspacePath) {
      return packages;
    }
  }

  return packages.concat(packageWorkspacePath);
};

export const updateYarnWorkspacesDeclaration = (
  workspaces: YarnWorkspaces.Workspaces,
  packages: YarnWorkspaces.Packages
): YarnWorkspaces.Workspaces => {
  if (workspaces === undefined) {
    return packages;
  }

  if ('packages' in workspaces) {
    workspaces.packages = packages;
  } else {
    workspaces = packages;
  }

  return workspaces;
};

export const findHostDirectory = async (intercept = false): Promise<string> => {
  const dir = await find(await fs.realpath(process.cwd()));

  if (dir !== null) {
    return dir;
  }

  const workspaceError = new NotFoundHostError();

  if (intercept) {
    throw workspaceError;
  } else {
    logError(workspaceError);
    process.exit(1);
  }

  async function find(possiblePath: string): Promise<string | null> {
    const isPathTooSmall = possiblePath.length < 10;

    if (isPathTooSmall) {
      return null;
    }

    const packageJsonPath = path.resolve(possiblePath, PACKAGE_JSON);
    return fs.existsSync(packageJsonPath) && isHostScope(await fs.readJSON(packageJsonPath))
      ? possiblePath
      : find(path.resolve(possiblePath, '..'));
  }
};

export const findPackageDirectory = async (intercept = false): Promise<string> => {
  const dir = await find(await fs.realpath(process.cwd()));

  if (dir !== null) {
    return dir;
  }

  const workspaceError = new NotFoundPackageError();

  if (intercept) {
    throw workspaceError;
  } else {
    logError(workspaceError);
    process.exit(1);
  }

  async function find(possiblePath: string): Promise<string | null> {
    const packageJsonPath = path.resolve(possiblePath, PACKAGE_JSON);
    let pkg: CLI.Package.AnyPackageJson = {} as CLI.Package.AnyPackageJson;

    if (fs.existsSync(packageJsonPath)) {
      pkg = await fs.readJSON(packageJsonPath);
    }

    const isPathTooSmall = possiblePath.length < 10;
    const isRoot = isHostScope(pkg);
    const isPackage = isPackageScope(pkg);

    switch (true) {
      case isPathTooSmall || isRoot:
        return null;

      case isPackage:
        return possiblePath;

      default:
        return find(path.resolve(possiblePath, '..'));
    }
  }
};
