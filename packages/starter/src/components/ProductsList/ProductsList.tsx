import React from 'react';
import { Box, Grommet, grommet, List } from 'grommet';

import { productsProgress } from './ProductsList.helpers';
import styles from './ProductsList.scss';

export const ProductsList = () => (
	<Grommet theme={grommet} className={styles.container}>
		<Box align="center" pad="medium" className={styles.list}>
			<List data={productsProgress}
						primaryKey={item => item.name}
						secondaryKey={item => `${item.percent}%`}
			/>
		</Box>
	</Grommet>
);
