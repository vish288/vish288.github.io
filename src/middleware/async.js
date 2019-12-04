import _assign from 'lodash/assign';

export default ({ dispatch }) => next => action => {
  //no promise to resolve
  if (!action.payload || !action.payload.then) {
    return next(action);
  }
  //promise resolved
  action.payload.then(response => {
    //const payload = _.assign({term: ''}, {repo: response.data});
    const newAction = _assign(action, { payload: response.data });
    return dispatch(newAction);
  });
}
