import React from 'react';
import { Box, grommet, Text } from 'grommet';
import { Diamond } from 'grommet-icons';
import { deepMerge } from 'grommet/utils';

export const DiamondContainer = ({ id, name, location, percent, textSize }) => (
  <Box key={id} align='center' alignSelf='center' direction='row' gap='medium'>
    <Diamond color='neutral-3' id={id} size='xlarge' />
    <Box align='center'>
      <Text size='medium' weight='bold'>
        {name}
      </Text>
      {percent && <Text size={textSize}> Complete: {percent}% </Text>}
      {location && <Text size={textSize}> Location: {location} </Text>}
    </Box>
  </Box>
);

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

export const connection = (fromTarget, toTarget, { ...rest } = {}) => ({
  fromTarget,
  toTarget,
  anchor: 'vertical',
  color: 'accent-4',
  thickness: 'xsmall',
  round: true,
  type: 'curved',
  ...rest
});
