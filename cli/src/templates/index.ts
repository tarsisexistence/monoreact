import { basicTemplate } from './basic';
import { reactTemplate } from './react';

export const templates = {
  basic: basicTemplate,
  react: reactTemplate
};

export type template = keyof typeof templates;

export const features = {
  playground: 'playground'
};

export type feature = keyof typeof features;
