import shell from 'shelljs';
import execa from 'execa';

import { PACKAGE_JSON } from './constants';

export const safePackageName = (name: string) =>
  name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '');

export function getAuthorName(): CLI.Package.Author {
  let author = '';

  author = shell
    .exec('npm config get init-author-name', { silent: true })
    .stdout.trim();

  if (author) {
    return author;
  }

  author = shell.exec('git config user.name', { silent: true }).stdout.trim();
  if (author) {
    setAuthorName(author);
    return author;
  }

  author = shell
    .exec('npm config get init-author-email', { silent: true })
    .stdout.trim();
  if (author) {
    return author;
  }

  author = shell.exec('git config user.email', { silent: true }).stdout.trim();
  if (author) {
    return author;
  }

  return author;
}

export function setAuthorName(author: CLI.Package.Author): void {
  shell.exec(`npm config set init-author-name "${author}"`, { silent: true });
}

export const sortPackageJson = async () => execa('sort-package-json');

export const prettifyPackageJson = async () =>
  execa(`prettier --write ${PACKAGE_JSON}`);

export const buildPackage = async () => execa('yarn build');

export const findWorkspacePackages = (
  workspaces: YarnWorkspaces.Packages | YarnWorkspaces.Config | undefined
): YarnWorkspaces.Packages => {
  if (workspaces === undefined) {
    return [];
  }

  if ('packages' in workspaces) {
    return workspaces.packages || [];
  }

  return workspaces;
};

export const findPackageSetupPath = (
  packages: YarnWorkspaces.Packages
): string =>
  packages.reduce(
    (res, pkg) =>
      pkg[pkg.length - 1] === '*' ? pkg.slice(0, pkg.length - 1) : res,
    '/'
  );
