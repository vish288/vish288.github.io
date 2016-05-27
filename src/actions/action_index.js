import {GH_API, TILES_LOADED, SEARCH_TERM_CHANGED} from "../constants/config";
import _ from "lodash";
import axios from "axios";


export function tilesLoaded() {
    "use strict";
    return {
        type: TILES_LOADED,
        payload: axios.get(GH_API)
    }
}


export function searchTermChanged({repo, term}) {
    "use strict";
    return {
        type: SEARCH_TERM_CHANGED,
        payload: filterData(repo, term)
    }
}

function filterData(repo, term) {
    "use strict";

    console.log("videos", repo);
    console.log("term", term);
    const termRegex = new RegExp(term);
    const returnValue = _.filter(repo, (repo)=>termRegex.test(repo.name));
    console.log(returnValue);
    return returnValue;
}