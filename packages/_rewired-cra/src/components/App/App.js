import React from 'react';
import styles from './App.css';

export function App({ num = 9 }) {
  const result = 2 + num;

  return (
    <div className={styles.App}>
      <p className={styles.AppTarsis}>....</p>
      Hello from shared {result}
    </div>
  );
}
