import React from 'react'
import { connect } from 'react-redux'
import { searchTermChanged } from '../actions'

class SearchSort extends React.Component {
  constructor (props) {
    super(props)
    this.state = { term: '' }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    this.setState({ term: e.target.value })
    return this.props.searchTermChanged(e.target.value)
  };

  render () {
    return (<div className="col-xs-12 input-group" style={{ margin: '10px' }}>
      <input
        type="text"
        className="form-control"
        value={this.state.term}
        placeholder="Search the repositories"
        onChange={this.handleChange}
      /></div>)
  }
}

const mapDispatchToProps = { searchTermChanged }

export default connect(null, mapDispatchToProps)(SearchSort)