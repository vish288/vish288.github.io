/**
 * Created by vsury1 on 5/27/16.
 */
import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {Router, browserHistory} from "react-router";
import reducers from "./reducers";
import routes from "./routes";
import {createStore, applyMiddleware} from "redux";
import Async from "./middleware/async";

const createdStore = applyMiddleware(Async)(createStore)(reducers);

ReactDOM.render(
    <Provider store={createdStore}>
        <Router children={routes} history={browserHistory}></Router>
    </Provider>
    , document.querySelector('.container'));
