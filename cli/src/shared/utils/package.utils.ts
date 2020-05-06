import path from 'path';
import fs from 'fs-extra';
import { exec } from 'shelljs';

import {
  NotFoundPackageWorkspaceError,
  NotFoundWorkspaceRootError
} from '../models';
import { logError } from './error.utils';

export const safePackageName = (name: string) =>
  name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '');

export function getAuthorName(): CLI.Package.Author {
  let author = '';

  author = exec('npm config get init-author-name', {
    silent: true
  }).stdout.trim();

  if (author) {
    return author;
  }

  author = exec('git config user.name', { silent: true }).stdout.trim();
  if (author) {
    setAuthorName(author);
    return author;
  }

  author = exec('npm config get init-author-email', {
    silent: true
  }).stdout.trim();
  if (author) {
    return author;
  }

  author = exec('git config user.email', { silent: true }).stdout.trim();
  if (author) {
    return author;
  }

  return author;
}

export function setAuthorName(author: CLI.Package.Author): void {
  exec(`npm config set init-author-name "${author}"`, { silent: true });
}

export const sortPackageJson = async () =>
  exec('npx sort-package-json', { silent: true });

export const buildPackage = async () => exec('yarn build', { silent: true });

export const findWorkspacePackages = (
  workspaces: YarnWorkspaces.Packages | YarnWorkspaces.Config | undefined
): YarnWorkspaces.Packages => {
  if (workspaces === undefined) {
    return [];
  }

  if ('packages' in workspaces) {
    return workspaces.packages;
  }

  return workspaces;
};

export const findPackageSetupPath = (
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

export async function getAllPackages(): Promise<CLI.Package.Package[]> {
  const a = exec('yarn workspaces info --json', { silent: true }).stdout.trim();
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
