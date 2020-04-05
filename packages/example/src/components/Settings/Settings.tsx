import React from 'react';
import { Box, Diagram, Grommet, Stack } from 'grommet';

import { progress } from '../../shared/data';
import { DiamondContainer } from './DiamondContainer';
import { connection, customTheme } from './Settings.helpers';

export const Settings = () => {
  const [draw, setDraw] = React.useState(true);

  const renderDiamond = React.useCallback(
    id => (
      <DiamondContainer
        key={id}
        id={id}
        location={progress[id - 1].location}
        name={progress[id - 1].name}
        percent={progress[id - 1].percent}
        textSize='small'
      />
    ),
    []
  );

  React.useEffect(() => {
    const timer = setInterval(() => {
      setDraw(value => !value);
    }, 1500);
    return () => clearInterval(timer);
  }, [setDraw]);

  const connections: any[] = [];

  if (draw) {
    connections.push(connection('6', '1', { anchor: 'vertical' }));
    connections.push(connection('6', '2', { anchor: 'vertical' }));
    connections.push(connection('6', '3', { anchor: 'vertical' }));
    connections.push(connection('7', '4', { anchor: 'vertical' }));
    connections.push(connection('7', '5', { anchor: 'vertical' }));
    connections.push(connection('7', '6', { anchor: 'vertical' }));
  }

  if (progress.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <Grommet theme={customTheme}>
      <Box align='center'>
        <Box pad='large'>
          <Stack>
            <Box>
              <Box alignSelf='center' margin={{ bottom: 'medium' }}>
                <DiamondContainer
                  key={1}
                  id={1}
                  location={progress[0].location}
                  name={progress[0].name}
                  percent={progress[0].percent}
                  textSize='small'
                />

                <Box
                  id='6'
                  margin={{ bottom: 'large', top: 'xsmall' }}
                  width='xsmall'
                />
              </Box>

              <Box direction='row' gap='xlarge'>
                {[2, 3].map(renderDiamond)}
              </Box>

              <Box alignSelf='center' margin={{ bottom: 'xsmall' }}>
                <Box
                  id='7'
                  margin={{ bottom: 'large', top: 'large' }}
                  width='xsmall'
                />
              </Box>

              <Box direction='row' gap='xlarge'>
                {[4, 5].map(renderDiamond)}
              </Box>
            </Box>
            <Diagram connections={connections} />
          </Stack>
        </Box>
      </Box>
    </Grommet>
  );
};
