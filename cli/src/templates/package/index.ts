import { basicTemplate } from './basic';
import { reactTemplate } from './react';
import { PackageTemplate } from '../template';

export const packageTemplates: Record<string, PackageTemplate> = {
  basic: basicTemplate,
  react: reactTemplate
};

export type packageTemplate = keyof typeof packageTemplates;
