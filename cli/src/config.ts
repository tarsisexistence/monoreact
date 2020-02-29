import { readJSON } from 'fs-extra';
import { findByPattern } from './utils';
import { templates } from './templates';

const respaceConfigFileName = 're-space.json';

interface RespaceConfig {
  scope: string;
  workspaces: string;
}

export interface CliOptions extends RespaceConfig {
  template: keyof typeof templates;
}

export const getRespaceJson = async ({
  scope,
  workspaces
}: Partial<CliOptions> = {}): Promise<RespaceConfig> => {
  const respaceJsonPath = findByPattern('./', respaceConfigFileName);
  const config: RespaceConfig = respaceJsonPath
    ? await readJSON(respaceJsonPath)
    : {
        packages: '.'
      };

  if (scope) {
    config.scope = scope;
  }

  if (workspaces) {
    config.workspaces = workspaces;
  }

  return config;
};
