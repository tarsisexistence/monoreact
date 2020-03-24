import React from 'react';
import { Box, Text } from 'grommet';
import { Diamond } from 'grommet-icons';

export const DiamondContainer = ({
  id,
  name,
  location,
  percent,
  textSize
}: any) => (
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
