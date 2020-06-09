import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App/App';
import { unregister } from './serviceWorker';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));

unregister();
