import reactTemplate from './react';
import basicTemplate from './basic';

export const templates = {
  basic: basicTemplate,
  react: reactTemplate
};

export type template = keyof typeof templates
