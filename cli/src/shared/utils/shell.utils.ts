import * as shell from 'shelljs';

shell.config.silent = true;

const cache = {
  command: '',
  output: {} as shell.ShellReturnValue
};

export function execWithCache(
  command: string,
  { noCache = false } = {}
): shell.ShellReturnValue {
  if (!noCache && cache.command === command) {
    return cache.output;
  }

  const output = shell.exec(command);

  if (noCache) {
    cache.command = '';
    cache.output = {} as shell.ShellReturnValue;
  } else {
    cache.command = command;
    cache.output = output;
  }

  return output;
}
