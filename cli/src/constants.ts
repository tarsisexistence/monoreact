import { resolveApp } from './utils';

export const paths = {
  appPackageJson: resolveApp('package.json'),
  tsconfigJson: resolveApp('tsconfig.json'),
  appRoot: resolveApp('.'),
  appSrc: resolveApp('src'),
  appErrorsJson: resolveApp('errors/codes.json'),
  appErrors: resolveApp('errors'),
  appDist: resolveApp('dist'),
  appConfig: resolveApp('respace.config.js')
};
