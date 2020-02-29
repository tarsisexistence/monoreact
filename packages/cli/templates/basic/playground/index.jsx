import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from '..';

const App = () => {
  return (
    <div>
      <Component/>
    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('root'));
