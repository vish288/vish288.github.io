/**
 * Created by vsury1 on 5/27/16.
 */

import _ from "lodash";
export default ({dispatch}) => next => action => {
    "use strict";
    //no promise to resolve
    if (!action.payload || !action.payload.then) {
        return next(action);
    }
    //promise resolved
    action.payload.then(response => {
        const newAction = _.assign(action, {payload: response.data});
        return dispatch(newAction);
    })
}
