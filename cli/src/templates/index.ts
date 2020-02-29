import { basicTemplate } from './basic';
import { reactTemplate } from './react';
import { reactTypescriptTemplate } from './react-typescript';

export const templates = {
  basic: basicTemplate,
  react: reactTemplate,
  'react-typescript': reactTypescriptTemplate
};

export type template = keyof typeof templates;
