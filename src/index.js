import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from './Store';
import { Provider } from 'react-redux';
import Lang from './Lang';

ReactDOM.render(
    <Provider store={store}>
      <Router>
        <Lang>
          <App />
        </Lang>
      </Router>
    </Provider>,
  document.getElementById('root')
);
