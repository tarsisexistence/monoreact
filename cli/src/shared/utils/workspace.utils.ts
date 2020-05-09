import path from 'path';
import fs from 'fs-extra';
import {
  NotFoundPackageWorkspaceError,
  NotFoundWorkspaceRootError
} from '../models';
import { logError } from './error.utils';
import { exec } from 'shelljs';

export const getWorkspacePackagePaths = (
  workspaces: YarnWorkspaces.Packages | YarnWorkspaces.Config | undefined
): YarnWorkspaces.Packages => {
  if (workspaces === undefined) {
    return [];
  }

  if ('packages' in workspaces) {
    return workspaces.packages ?? [];
  }

  return workspaces;
};

export const getWorkspacePackageSetupPath = (
  packages: YarnWorkspaces.Packages
): string => {
  const rootPath = '/';
  const packageSetupPath = packages.reduce(
    (path, pkg) =>
      pkg[pkg.length - 1] === '*' ? pkg.slice(0, pkg.length - 2) : path,
    rootPath
  );
  return packageSetupPath === rootPath ? 'packages' : packageSetupPath;
};

async function findWorkspaceDir<TPackageJson>(
  possiblePath: string,
  conditionCallback: (pkg: TPackageJson) => boolean
): Promise<string | null> {
  // the path is too small
  if (possiblePath.length < 10) {
    return null;
  }

  const packageJsonPath = path.resolve(possiblePath, 'package.json');
  return fs.existsSync(packageJsonPath) &&
    conditionCallback((await fs.readJSON(packageJsonPath)) as TPackageJson)
    ? possiblePath
    : findWorkspaceDir(path.resolve(possiblePath, '..'), conditionCallback);
}

export const findWorkspaceRootDir = async (
  intercept = false
): Promise<string> => {
  const dir = await findWorkspaceDir<CLI.Package.WorkspaceRootPackageJSON>(
    await fs.realpath(process.cwd()),
    pkg => pkg.workspaces !== undefined && pkg.private
  );

  if (dir === null) {
    const workspaceError = new NotFoundWorkspaceRootError();

    if (intercept) {
      throw workspaceError;
    } else {
      logError(workspaceError);
      process.exit(1);
    }
  }

  return dir;
};

export const findWorkspacePackageDir = async (
  intercept = false
): Promise<string> => {
  const dir = await findWorkspaceDir<CLI.Package.WorkspacePackageJSON>(
    await fs.realpath(process.cwd()),
    pkg => pkg.workspace && !pkg.private
  );

  if (dir === null) {
    const workspaceError = new NotFoundPackageWorkspaceError();

    if (intercept) {
      throw workspaceError;
    } else {
      logError(workspaceError);
      process.exit(1);
    }
  }

  return dir;
};

export async function getWorkspacesInfo(): Promise<CLI.Package.Package[]> {
  const a = exec('yarn workspaces --json info', { silent: true }).stdout.trim();
  const yarnWorkspaces = JSON.parse(JSON.parse(a).data);
  const rootDir = await findWorkspaceRootDir();

  return Object.keys(yarnWorkspaces).reduce(
    (packages: CLI.Package.Package[], pkg: string) => [
      ...packages,
      {
        name: pkg,
        path: path.resolve(rootDir, yarnWorkspaces[pkg].location)
      }
    ],
    []
  );
}
