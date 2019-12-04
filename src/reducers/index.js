import { combineReducers } from 'redux';
import { SEARCH_TERM_CHANGED, TILES_LOADED } from '../constants/config';

export default combineReducers({
  tiles: tilesReducer,
  searchTerm: filteredTilesReducer,
});

function tilesReducer(state = null, action) {
  if (action.type === TILES_LOADED) {
    return action.payload;
  } else {
    return state;
  }
}

function filteredTilesReducer(state = null, action) {
  if (action.type === SEARCH_TERM_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
}

