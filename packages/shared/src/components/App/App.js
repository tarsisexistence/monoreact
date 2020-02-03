import React from 'react';
import './App.css';

export function App({ num = 9 }) {
  const result = 1 + num;

  return (
      <div className="App">
        <p className="AppTarsis">....</p>
        Hello from shared {result}
      </div>
  );
}
