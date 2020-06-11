import React from 'react';
import { DatePicker, Products } from '@re-space/example';

import styles from './App.module.css';

export const App: React.FC = () => (
  <div className={styles.container}>
    <Products />
    Re-space: react workspace groundwork
    <DatePicker />
  </div>
);
