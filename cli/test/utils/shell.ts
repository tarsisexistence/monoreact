import * as shell from 'shelljs';

shell.config.silent = true;

// simple shell.exec "cache" that doesn't re-run the same command twice in a row
let prevCommand = '';
let prevCommandOutput = {} as shell.ShellReturnValue;

export function execWithCache(
  command: string,
  { noCache = false } = {}
): shell.ShellReturnValue {
  if (!noCache && prevCommand === command) {
    return prevCommandOutput;
  }

  const output = shell.exec(command);

  if (noCache) {
    prevCommand = '';
    prevCommandOutput = {} as shell.ShellReturnValue;
  } else {
    prevCommand = command;
    prevCommandOutput = output;
  }

  return output;
}

// shell.js grep wrapper returns true if pattern has matches in file
export function grep(pattern: RegExp, fileName: string[]): boolean {
  const output = shell.grep(pattern, fileName);
  // output.code is always 0 regardless of matched/unmatched patterns
  // so need to test output.stdout
  return Boolean(output.stdout.match(pattern));
}
