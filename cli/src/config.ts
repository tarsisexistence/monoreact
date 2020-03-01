import { packageTemplate } from './templates/package';
import { feature } from './templates/feature';

export interface CliOptions {
  workspaces: string;
  template: packageTemplate;
  feature: feature;
}
