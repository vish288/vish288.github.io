/**
 * Created by vsury1 on 5/27/16.
 */
import React from "react";
import {connect} from "react-redux";
import Tile from "./tile";

class Tiles extends React.Component {
    constructor(props) {
        super(props);
        this.renderTiles = this.renderTiles.bind(this);
    }

    renderTiles() {
        console.log(this.props.tiles);
        this.props.tiles ?
            this.props.tiles.map(tile => {
                console.log("tile", tile);
                return (<Tile key={tile.id} tile={tile}></Tile>)
            }) : 'Loading ...';
    }

    render() {
        return (<div>{this.renderTiles}</div>)
    }
}

function mapStateToProps({tiles}) {
    "use strict";
    console.log("tiles Map ::: ", tiles);
    return {tiles};
}

export default connect(mapStateToProps)(Tiles);
