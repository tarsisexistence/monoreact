import { basicTemplate } from './basic';
import { reactTemplate } from './react';

export const packageTemplates: Record<CLI.Template.package, CLI.Template.PackageOptions> = {
  basic: basicTemplate,
  react: reactTemplate
};
