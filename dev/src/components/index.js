/**
 * Created by vsury1 on 5/27/16.
 */
import React, {PropTypes, Component} from "react";
import SearchSort from "../containers/search-sort";
import Tiles from "../containers/tiles";
import {connect} from "react-redux";
import {tilesLoaded} from "../actions/action_index";
export default class App extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(tilesLoaded());
    }

    render() {
        return (
            <div className="row">
                <SearchSort/>
                <div className="col-xs-12">
                    <Tiles/>
                </div>
            </div>
        )
    }
}

App.prototypes = {
    dispatch: PropTypes.func.isRequired
};

export default connect()(App);