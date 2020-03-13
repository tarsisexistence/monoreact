import { basicTemplate } from './basic';
import { reactTemplate } from './react';

export const packageTemplates: Record<
  CLI.Template.Package,
  CLI.Template.PackageOptions
> = {
  basic: basicTemplate,
  react: reactTemplate
};
