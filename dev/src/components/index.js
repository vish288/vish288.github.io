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
            <section>
                <header
                    style={{position:'fixed', height:50, top:0, left:0, right:0, marginBottom : 20}}>
                </header>
                <div className="row" style={{marginTop:60}}>
                    <SearchSort/>
                    <div className="col-xs-12">
                        <Tiles/>
                    </div>
                </div>
                <footer style={{position:'fixed', height:50, bottom:0, left:0, right:0, marginTop : 20}}>
                    Visweshwaran™
                </footer>
            </section>
        )
    }
}

App.prototypes = {
    dispatch: PropTypes.func.isRequired
};

export default connect()(App);