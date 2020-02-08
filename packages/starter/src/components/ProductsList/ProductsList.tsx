import React, { useState } from 'react';
import { Box, Grommet, grommet, List } from 'grommet';

import { productsProgress } from './ProductsList.helpers';
import styles from './ProductsList.scss';

export const ProductsList = () => {
	const [, setClicked] = useState();

	return (
		<Grommet theme={grommet}>
			<Box align="center" pad="medium" className={styles.itemList}>
				<List data={productsProgress}
							onClickItem={event => setClicked(event.item)}
							primaryKey={item => item.name}
							secondaryKey={item => item.percent}
				/>
				</Box>
			</Grommet>
	);
};
