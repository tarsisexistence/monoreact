import React from 'react';
import { Box, CheckBox, Meter } from 'grommet';

export const renderColumnPercent = (datum: Product.Progress) => (
  <Box pad={{ vertical: 'small' }}>
    <Meter size='small' thickness='small' values={[{ value: datum.percent }]} />
  </Box>
);

export const renderColumnCheck = (checked: string[], onCheck: any) => (
  datum: Product.Progress
) => (
  <CheckBox
    key={datum.name}
    checked={checked.includes(datum.name)}
    onChange={e => onCheck(e, datum.name)}
  />
);
