import { doczTemplate } from './docz';
import { playgroundTemplate } from './playground';

export const featureTemplates: Record<
  CLI.Template.feature,
  CLI.Template.FeatureOptions
> = {
  docz: doczTemplate,
  playground: playgroundTemplate
};
