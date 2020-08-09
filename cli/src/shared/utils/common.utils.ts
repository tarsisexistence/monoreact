import { always } from 'ramda';
import { exec } from 'shelljs';

export const noop: () => void = always<void>(void 0);

export function setNpmAuthorName(author: CLI.Package.Author): void {
  exec(`npm config set init-author-name "${author}"`, { silent: true });
}

export function getNpmAuthorName(): CLI.Package.Author | null {
  const npmNameAuthor = exec('npm config get init-author-name', {
    silent: true
  }).stdout.trim();

  if (npmNameAuthor) {
    return npmNameAuthor;
  }

  const gitNameAuthor = exec('git config user.name', { silent: true }).stdout.trim();

  if (gitNameAuthor) {
    setNpmAuthorName(gitNameAuthor);
    return gitNameAuthor;
  }

  const npmEmailAuthor = exec('npm config get init-author-email', {
    silent: true
  }).stdout.trim();

  if (npmEmailAuthor) {
    return npmEmailAuthor;
  }

  const gitEmailAuthor = exec('git config user.email', { silent: true }).stdout.trim();

  if (gitEmailAuthor) {
    return gitEmailAuthor;
  }

  return null;
}

export function deleteNpmAuthorName(author: CLI.Package.Author): void {
  exec(`npm config delete "${author}"`, { silent: true });
}
