import { grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';

export const customTheme = deepMerge(grommet, {
  diagram: {
    extend: `@keyframes
  example {
    to {
      stroke-dashoffset: 0;
    }
  }
  path {
    stroke-dasharray: 500;
    stroke-dashoffset: 500;
    animation: example 3s linear forwards;
  }`
  }
});

export const connection = (fromTarget: any, toTarget: any, { ...rest }) => ({
  fromTarget,
  toTarget,
  anchor: 'vertical',
  color: 'accent-4',
  thickness: 'xsmall',
  round: true,
  type: 'curved',
  ...rest
});
