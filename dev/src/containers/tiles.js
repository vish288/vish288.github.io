/**
 * Created by vsury1 on 5/27/16.
 */
import React from "react";
import {connect} from "react-redux";
import Tile from "./tile";
import _ from "lodash";

class Tiles extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (<div className="row">{
            this.props.tiles ?
                this.props.tiles.map(tile => {
                    return (<Tile key={tile.id} tile={tile}></Tile>)
                }) : 'Loading ...'}
        </div>)
    }
}

function mapStateToProps(state) {
    let tiles;
    if (state.searchTerm) {
        const termRegex = new RegExp(state.searchTerm, "gi");
        tiles = _.filter(state.tiles, (repo)=>termRegex.test(repo.name));
    }
    else {
        return {tiles: state.tiles, term: state.searchTerm};
    }
    return {tiles: tiles, term: state.searchTerm};
}

export default connect(mapStateToProps)(Tiles);
