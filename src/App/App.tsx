import React from 'react';

import { Products } from '@re-space/example';
import { Component } from '@re-space/example2';
import styles from './App.module.css';

export const App = () => (
  <div className={styles.container}>
    <Products />
    Re-space: react workspace groundwork1
    <Component />
  </div>
);
