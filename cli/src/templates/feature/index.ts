import { FeatureTemplate } from '../template';
import { doczTemplate } from './docz';
import { playgroundTemplate } from './playground';

export const featureTemplates: Record<string, FeatureTemplate> = {
  docz: doczTemplate,
  playground: playgroundTemplate
};

export type feature = keyof typeof featureTemplates;
