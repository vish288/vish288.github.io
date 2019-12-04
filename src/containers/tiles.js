import _filter from 'lodash/filter';
import React from 'react';
import { connect } from 'react-redux';
import Tile from './tile';

const Tiles = ({ tiles }) => (<div className="row">
  {tiles ? tiles.map(tile => (<Tile key={tile.id} tile={tile}/>)) : 'Loading ...'}
</div>);

function mapStateToProps(state) {
  let tiles;
  if (state.searchTerm) {
    const termRegex = new RegExp(state.searchTerm, 'gi');
    tiles = _filter(state.tiles, (repo) => termRegex.test(repo.name));
  } else {
    return { tiles: state.tiles, term: state.searchTerm };
  }
  return { tiles: tiles, term: state.searchTerm };
}

export default connect(mapStateToProps)(Tiles);
