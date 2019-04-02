import React, { Component } from 'react'
import { connect } from 'react-redux'
import Player from '../player/Player'

class Stream extends Component {

  render() {
    return (
      <div>
        <Player mediaUrl={"http://clips.vorwaerts-gmbh.de/VfE_html5.mp4"} startTime={30}/>
      </div>
    );
  }
}

const mapStateToProps = state => { return state }

export default connect(mapStateToProps)(Stream)
