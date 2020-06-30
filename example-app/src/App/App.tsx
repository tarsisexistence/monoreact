import React from 'react';
import { Products } from '@monoreact/example';
import { DatePicker } from '@tarsis/datepicker';

import styles from './App.module.css';

export const App: React.FC = () => (
  <div className={styles.container}>
    <Products />
    Monoreact: react workspace groundwork
    <DatePicker />
  </div>
);
