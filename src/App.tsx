import React from 'react';
import { App as SharedApp } from '@repo-warehouse/shared';
import { Amp } from '@repo-warehouse/webpack';
import { Signal } from '@repo-warehouse/bundle';
import './App.css';

const App = () => {
  const v = Math.round(Math.random() * 10);
  return (
    <div className="App">
      I am core
      <Amp/>
      <Signal/>
      <SharedApp num={v}/>
    </div>
  );
};

export default App;
