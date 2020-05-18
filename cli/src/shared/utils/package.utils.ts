import { exec } from 'shelljs';

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

export const sortPackageJson = () =>
  exec('npx sort-package-json', { silent: true });

export const buildPackage = () => exec('yarn build', { silent: true });

export const installDependencies = () => exec('yarn install', { silent: true });
