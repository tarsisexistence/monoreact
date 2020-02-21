import React from 'react';
import { Box, CheckBox, Meter } from 'grommet';

export const renderColumnPercent = datum => (
  <Box pad={{ vertical: 'small' }}>
    <Meter size='small' thickness='small' values={[{ value: datum.percent }]} />
  </Box>
);

export const renderColumnCheck = (checked, onCheck) => datum => (
  <CheckBox
    key={datum.name}
    checked={checked.indexOf(datum.name) !== -1}
    onChange={e => onCheck(e, datum.name)}
  />
);
