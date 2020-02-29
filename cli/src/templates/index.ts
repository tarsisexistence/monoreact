import { basicTemplate } from './basic';
import { reactTemplate } from './react';

export const templates = {
  basic: basicTemplate,
  react: reactTemplate
};

export type template = keyof typeof templates;
