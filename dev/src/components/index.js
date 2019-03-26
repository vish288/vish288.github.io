import React, { Component } from 'react'
import SearchSort from '../containers/search-sort'
import Tiles from '../containers/tiles'
import { connect } from 'react-redux'
import { tilesLoaded } from '../actions'

class App extends Component {
  constructor (props) {
    super(props)
  }

  componentWillMount () {
    this.props.tilesLoaded()
  }

  render () {
    return (
      <section className='container'>
        <header className='header'
                style={{ height: '50px', backgroundColor: '#443266' }}/>
        <article className="row" style={{ marginTop: 60 }}>
          <SearchSort/>
          <section className="col-xs-12" style={{ margin: '10px' }}>
            <Tiles/>
          </section>
        </article>
        <footer className='row' style={{
          display: 'flex',
          backgroundColor: '#8C489F',
          position: 'fixed',
          bottom: 0,
          right: 0,
          left: 0,
          height: '45px',
          padding: '10px',
        }}>
          <span className="col-xs-6">Visweshwaran™</span>
        </footer>
      </section>
    )
  }
}

const mapDispatchToProps = {
  tilesLoaded,
}

export default connect(null, mapDispatchToProps)(App)