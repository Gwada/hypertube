import React, { Component } from 'react'
import { connect } from 'react-redux'
import host from '../../config'
import ReactPlayer from 'react-player';

/**
 * Component takes 2 props =>
 *    onChange -> Method called to update video time in db.
 *    startTime -> Time in seconds where the video should start.
 *    mediaUrl -> Link of the video to read.
 *    movieId -> ID of the movie reading, in order to set subtitles.
 */
class Player extends Component {

  _isMounted = false
  setStateCheck = (state, callback) => {
    if (this._isMounted === true) {
      this.setState(state, () => {
        if (callback) callback()
      })
    }
  }

  state = {
    oldTime: 0,
    currentTime: 0,
    subtitles: {
      fre: null,
      eng: null
    }
  }

  enableEvent = false
  player = null

  componentDidMount = () => {
    let { startTime } = this.props;
    this.player = document.getElementById("player");
    if (this.player.currentTime < startTime)
      this.player.currentTime = startTime;
    document.addEventListener('keydown', this.handleKeyPress)
    this.fetchSubtitles()
  }

  handleTimeChange = e => {
    this.setStateCheck({
      currentTime: e.target.currentTime,
    }, () => {
      let { currentTime, oldTime } = this.state;
      if (Math.abs(currentTime - oldTime) > 5 && this.props.onChange) {
        this.setStateCheck({ oldTime: currentTime });
        this.props.onChange(currentTime);
      }
    })
  }

  fetchSubtitles = (redo = true) => {
    const { movieId } = this.props
    const { fre, eng } = this.state.subtitles
    fetch(host + '/api/movies/subtitles/' + movieId + '/eng')
    .then(res => {
      this.setStateCheck({
        ...this.state,
        subtitles: {
          ...this.state.subtitles,
          eng: res.status === 200
        }
      })
    })
    .catch(err => {
      // Handle err
    })
    fetch(host + '/api/movies/subtitles/' + movieId + '/fre')
    .then(res => {
      this.setStateCheck({
        ...this.state,
        subtitles: {
          ...this.state.subtitles,
          fre: res.status === 200
        }
      })
    })
    .catch(err => {
      // Handle err
    })
    if (!fre && !eng && redo) {
      setTimeout(() => this.fetchSubtitles(false), 2500);
    }
  }

  handleKeyPress = e => {
    const { player } = this
    if (!this.enableEvent || !this.player) return
    if (document.activeElement.tagName === "INPUT") return
    let needsPrevent = true
    switch (e.key) {
      case " ":
        player.paused ? player.play() : player.pause()
        break
      case "ArrowRight":
        player.currentTime += 10
        break
      case "ArrowLeft":
        player.currentTime -= 10
        break
      case "ArrowUp":
        player.volume > .9 ? player.volume = 1 : player.volume += .1
        break
      case "ArrowDown":
        player.volume < .1 ? player.volume = 0 : player.volume -= .1
        break
      default:
        needsPrevent = false
    }
    if (needsPrevent) e.preventDefault()
  }

  componentWillMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { mediaUrl, movieId, locales } = this.props
    const { fre, eng } = this.state.subtitles
    if (!mediaUrl) return null
    return (
      <ReactPlayer
        id="player"
        controls={true}
        style={{width: '100%'}}
        url={mediaUrl}
        config={{
          file: {
            tracks: [
              {kind: 'subtitles', src: host + '/api/movies/subtitles/' + movieId + '/eng', srcLang: 'en', label: 'English'},
              {kind: 'subtitles', src: host + '/api/movies/subtitles/' + movieId + '/fre', srcLang: 'fr', label: 'Français', default: locales.code === "fr"}
            ]
          }
        }}
      />
    );
  }

}

const mapStateToProps = state => { return state }

export default connect(mapStateToProps)(Player)
