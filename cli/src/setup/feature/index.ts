import { doczTemplate } from './docz';
import { playgroundTemplate } from './playground';

export const featureTemplates: Record<
  CLI.Template.Feature,
  CLI.Template.FeatureOptions
> = {
  docz: doczTemplate,
  playground: playgroundTemplate
};
