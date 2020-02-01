import React from 'react';
import { App as SharedApp } from '@repo-warehouse/shared';
import './App.css';

const App = () => {
  return (
    <div className="App">
      I am core
      <SharedApp/>
    </div>
  );
};

export default App;
