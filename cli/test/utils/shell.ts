import * as shell from 'shelljs';

shell.config.silent = true;

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
