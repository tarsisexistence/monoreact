import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import { Products } from '..';

const App = () => {
  return (
    <div>
      <Products/>
    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('root'));
