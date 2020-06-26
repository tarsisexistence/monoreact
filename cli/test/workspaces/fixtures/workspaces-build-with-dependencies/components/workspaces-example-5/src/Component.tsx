import React from 'react';
import { sum } from '@workspaces-build-with-dependencies/workspaces-example-3';

import styles from './Component.scss';

export const Component: React.FC = () => <section className={styles.container}>{sum(1, 2)}</section>;
