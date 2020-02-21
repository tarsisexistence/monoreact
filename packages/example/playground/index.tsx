import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Products } from '..';

const App = () => {
  return (
    <div>
      <Products/>
    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('root'));
