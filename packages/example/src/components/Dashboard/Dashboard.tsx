import React from 'react';
import { Box, Grommet, grommet, DataTable, Text, CheckBox } from 'grommet';

import { progress } from '../../shared/data';
import { renderColumnCheck, renderColumnPercent } from './Dashboard.helpers';
import styles from './Dashboard.scss';

export const Dashboard: React.FC = () => {
  const [checked, setChecked] = React.useState<string[]>([]);

  const onCheck = (event: any, value: string) => {
    if (event.target.checked) {
      setChecked([...checked, value]);
    } else {
      setChecked(checked.filter(item => item !== value));
    }
  };

  const columnDashboard = [
    {
      property: 'name',
      header: <Text>Name</Text>,
      primary: true
    },
    {
      property: 'location',
      header: <Text>Location</Text>,
      primary: true
    },
    {
      property: 'percent',
      header: 'Complete',
      render: renderColumnPercent
    }
  ];

  const controlledColumns = columnDashboard.map(col => ({ ...col }));

  const onCheckAll = (event: any) =>
    setChecked(event.target.checked ? progress.map(datum => datum.name) : []);

  return (
    <Grommet theme={grommet}>
      <Box align='center' pad='medium'>
        <DataTable
          className={styles.dashboardTable}
          columns={[
            {
              property: 'checkbox',
              render: renderColumnCheck(checked, onCheck),
              header: (
                <CheckBox
                  checked={checked.length === progress.length}
                  indeterminate={
                    checked.length > 0 && checked.length < progress.length
                  }
                  onChange={onCheckAll}
                />
              ),
              sortable: false
            },
            ...controlledColumns
          ].map(col => ({ ...col }))}
          data={progress}
          size='medium'
          sortable={true}
        />
      </Box>
    </Grommet>
  );
};
