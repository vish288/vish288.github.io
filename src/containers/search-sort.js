/**
 * Created by vsury1 on 5/27/16.
 */
import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {searchTermChanged} from "../actions/action_index";
class SearchSort extends React.Component {
    constructor(props) {
        super(props);
        this.state = {term: ''};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({term: e.target.value});
        return this.props.searchTermChanged({repo: this.props.tiles, term: e.target.value});
    };

    render() {
        return (<div><input
            type="text"
            value={this.state.term}
            placeholder="Search the repositories"
            onChange={this.handleChange}
        /></div>)
    }
}

function mapStateToProps({tiles}) {
    "use strict";
    return {tiles};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({searchTermChanged}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchSort);