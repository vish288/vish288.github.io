import { combineReducers } from 'redux'
import { SEARCH_TERM_CHANGED, TILES_LOADED } from '../constants/config'

export default combineReducers({
  tiles: tilesReducer,
  searchTerm: filteredTilesReducer,
})

function tilesReducer (state = null, action) {
  switch (action.type) {
    case TILES_LOADED:
      return action.payload
    default:
      return state
  }
}

function filteredTilesReducer (state = null, action) {
  switch (action.type) {
    case SEARCH_TERM_CHANGED:
      return action.payload
    default:
      return state
  }
}

