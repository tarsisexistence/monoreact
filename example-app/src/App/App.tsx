import React from 'react';
import { Products } from '@monoreact/package-example';
import { DatePicker } from '@tarsis/datepicker';
import AxeMode from 'axe-mode';

import styles from './App.module.css';

export const App: React.FC = () => (
  <AxeMode disabled={process.env.NODE_ENV !== 'development'}>
    <div className={styles.container}>
      <Products />
      Monoreact: react workspace groundwork
      <DatePicker />
    </div>
  </AxeMode>
);
