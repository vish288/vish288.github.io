import {GH_API, TILES_LOADED, SEARCH_TERM_CHANGED} from "../constants/config";
import axios from "axios";


export function tilesLoaded() {
    "use strict";
    return {
        type: TILES_LOADED,
        payload: axios.get(GH_API)
    }
}


export function searchTermChanged(term) {
    "use strict";
    return {
        type: SEARCH_TERM_CHANGED,
        payload: term
    }
}