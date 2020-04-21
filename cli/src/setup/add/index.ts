import { doczTemplate } from './docz.add';
import { playgroundTemplate } from './playground.add';

export const featureTemplates: Record<
  CLI.Template.AddType,
  CLI.Template.AddOptions
> = {
  docz: doczTemplate,
  playground: playgroundTemplate
};
