import React from 'react';
import { App as SharedApp } from '@repo-warehouse/shared';
import './App.css';

const App = () => {
  const v = Math.round(Math.random() * 10);
  return (
    <div className="App">
      I am core
      <SharedApp num={v}/>
    </div>
  );
};

export default App;
