import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import './index.css';
import App from './Pages/App';
import birdStore from './Stores/BirdCage';

ReactDOM.render(
  <Provider birdStore={birdStore}>
    <App />
  </Provider>,
  document.getElementById('root')
);
