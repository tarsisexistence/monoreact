import { FeatureTemplate } from '../template';
import { playgroundTemplate } from './playground';

export const featureTemplates: Record<string, FeatureTemplate> = {
  playground: playgroundTemplate
};

export type feature = keyof typeof featureTemplates;
