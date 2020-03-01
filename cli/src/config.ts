import { template, feature } from './templates';

interface RespaceConfig {
  scope: string;
  workspaces: string;
}

export interface CliOptions extends RespaceConfig {
  template: template;
  feature: feature;
}
