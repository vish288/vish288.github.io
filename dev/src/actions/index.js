import { GH_API, SEARCH_TERM_CHANGED, TILES_LOADED } from '../constants/config'
import axios from 'axios'

export const tilesLoaded = () => ({
  type: TILES_LOADED,
  payload: axios.get(GH_API),
})

export const searchTermChanged = (term) => ({
  type: SEARCH_TERM_CHANGED,
  payload: term,
})