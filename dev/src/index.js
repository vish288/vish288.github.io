import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { createBrowserHistory } from 'history'
import reducers from './reducers'
import routes from './routes'
import { applyMiddleware, createStore } from 'redux'
import Async from './middleware/async'

const createdStore = applyMiddleware(Async)(createStore)(reducers)

ReactDOM.render(
  <Provider store={createdStore}>
    <Router children={routes} history={createBrowserHistory()}/>
  </Provider>
  , document.querySelector('.root'))
