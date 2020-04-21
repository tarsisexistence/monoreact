import { doczTemplate } from './docz.add';
import { playgroundTemplate } from './playground.add';

export const featureTemplates: Record<
  CLI.Template.Feature,
  CLI.Template.AddOptions
> = {
  docz: doczTemplate,
  playground: playgroundTemplate
};
