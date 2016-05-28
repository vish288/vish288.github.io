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


    }

    render() {
        return (<div>{
            this.props.tiles ?
                this.props.tiles.map(tile => {
                    return (<Tile key={tile.id} tile={tile}></Tile>)
                }) : 'Loading ...'}
        </div>)
    }
}

function mapStateToProps(state) {

    return {tiles: state.tiles, term: state.term};
}

export default connect(mapStateToProps)(Tiles);
