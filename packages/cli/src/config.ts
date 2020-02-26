import { readJSON } from 'fs-extra';
import { findByPattern } from './utils';
import { templates } from './templates';

const respaceConfigFileName = 're-space.json';

interface RespaceConfig {
  scope: string;
  packages: string;
}

export interface CliOptions extends RespaceConfig {
  template: keyof typeof templates;
}

export const getRespaceJson = async ({
  scope,
  packages
}: Partial<CliOptions> = {}): Promise<RespaceConfig> => {
  const respaceJsonPath = findByPattern('./', respaceConfigFileName);
  const config: RespaceConfig = respaceJsonPath
    ? await readJSON(respaceJsonPath)
    : {};

  if (scope) {
    config.scope = scope;
  }

  if (packages) {
    config.packages = packages;
  }

  return config;
};
