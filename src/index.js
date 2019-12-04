import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { applyMiddleware, createStore } from 'redux';
import './index.css';
import Async from './middleware/async';
import reducers from './reducers';
import routes from './routes';
import * as serviceWorker from './serviceWorker';


const createdStore = applyMiddleware(Async)(createStore)(reducers);

ReactDOM.render(<Provider store={createdStore}>
  <Router children={routes} history={createBrowserHistory()}/>
</Provider>, document.querySelector('.root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
