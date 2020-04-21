import { basicTemplate } from './basic.generate';
import { reactTemplate } from './react.generate';

export const packageTemplates: Record<
  CLI.Template.Package,
  CLI.Template.GenerateOptions
> = {
  basic: basicTemplate,
  react: reactTemplate
};
