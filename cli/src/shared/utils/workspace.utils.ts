import path from 'path';
import fs from 'fs-extra';
import { exec } from 'shelljs';

import { NotFoundPackageWorkspaceError, NotFoundWorkspaceRootError } from '../models';
import { logError } from './error.utils';
import { PACKAGE_JSON } from '../constants/package.const';

const isWorkspaceRoot = (pkg: CLI.Package.WorkspaceRootPackageJSON) => pkg.workspaces !== undefined && pkg.private;
const isWorkspacePackage = (pkg: CLI.Package.WorkspacePackageJSON) => pkg.workspace && !pkg.private;

export const getWorkspacesFromDeclaration = (workspaces: YarnWorkspaces.Workspaces): YarnWorkspaces.Packages => {
  if (workspaces === undefined) {
    return [];
  }

  if ('packages' in workspaces) {
    return workspaces.packages ?? [];
  }

  return workspaces;
};

export const getWorkspacePackageSetupPath = (packages: YarnWorkspaces.Packages): string => {
  if (packages.length === 0) {
    return 'packages';
  }

  const wildcard = packages.find(pkg => pkg[pkg.length - 1] === '*');

  if (wildcard !== undefined) {
    return wildcard.slice(0, wildcard.length - 2);
  }

  return packages[0].split('/').filter(Boolean).slice(0, -1).join('/');
};

export async function getWorkspacesInfo(): Promise<CLI.Package.PackageInfo[]> {
  const rootDir = await findWorkspaceRootDir();
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

export const includePackageIntoWorkspaces = ({
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
  const workspacesSetupWildcard = dir === '' ? '*' : `${dir}/*`;

  for (const pkg of packages) {
    if (pkg === workspacesSetupWildcard || pkg === packageWorkspacePath) {
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

export const findWorkspaceRootDir = async (intercept = false): Promise<string> => {
  const dir = await find(await fs.realpath(process.cwd()));

  if (dir !== null) {
    return dir;
  }

  const workspaceError = new NotFoundWorkspaceRootError();

  if (intercept) {
    throw workspaceError;
  } else {
    logError(workspaceError);
    process.exit(1);
  }

  async function find(possiblePath: string): Promise<string | null> {
    const isPathTooSmall = possiblePath.length < 10;
    const packageJsonPath = path.resolve(possiblePath, PACKAGE_JSON);

    if (isPathTooSmall) {
      return null;
    }

    return fs.existsSync(packageJsonPath) && isWorkspaceRoot(await fs.readJSON(packageJsonPath))
      ? possiblePath
      : find(path.resolve(possiblePath, '..'));
  }
};

export const findWorkspacePackageDir = async (intercept = false): Promise<string> => {
  const dir = await find(await fs.realpath(process.cwd()));

  if (dir !== null) {
    return dir;
  }

  const workspaceError = new NotFoundPackageWorkspaceError();

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
    const isRoot = isWorkspaceRoot(pkg);
    const isPackage = isWorkspacePackage(pkg);

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
