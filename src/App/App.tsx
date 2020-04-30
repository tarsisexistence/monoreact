import React from 'react';

import { Products } from '@re-space/example';
import styles from './App.module.css';

export const App: React.FC = () => (
  <div className={styles.container}>
    <Products />
    Re-space: react workspace groundwork
  </div>
);
