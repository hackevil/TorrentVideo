import React from 'react'

import AppBar from 'material-ui/lib/app-bar'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Divider from 'material-ui/lib/divider'
import IconButton from 'material-ui/lib/icon-button'
import ActionHome from 'material-ui/lib/svg-icons/action/home'
import AvVideoLibrary from 'material-ui/lib/svg-icons/av/video-library'
import ActionPowerSettingsNew from 'material-ui/lib/svg-icons/action/power-settings-new'
import GridList from 'material-ui/lib/grid-list/grid-list'
import GridTile from 'material-ui/lib/grid-list/grid-tile'


import Auth from '../actions/auth'

const Video = React.createClass({
  render () {
    return (
      <video id="video" className="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto" data-setup="{}" src={this.props.item} style={this.props.style}>
      </video>
    )
  }
})

const MovieList = React.createClass({
  onUpdate (oEvent) {
    this.props.onUpdate(oEvent.target.childNodes[0].data)
  },

  render () {
    const self = this
    let movieList = this.props.items.map(function (item) {
      return (
        <ListItem key={item.name} primaryText={item.name} onTouchTap={self.onUpdate} />
      )
    })

    return (
      <List
        subheader='Latest Videos'
        style={this.props.style}>
        {movieList}
      </List>
    )
  }
})

const Home = React.createClass({

  contextTypes: {
    history: React.PropTypes.object.isRequired
  },

  getInitialState () {
    return {
      items: [],
      selectedItem: ''
    }
  },

  logout() {
    Auth.logout()
    this.context.history.pushState(null, '/login')
  },

  componentDidMount () {
    const self = this
    $.ajax({
      url: '/getData',
      dataType: 'json',
      cache: false,
      success: function (data) {
        self.setState({
          items: data,
          selectedItem: data[0].url
        })
      },
      error: function (err) {
        console.log('Error', err)
      }
    })
  },

  onUpdate (item) {
    this.setState({
      selectedItem: item
    })
  },

  render() {
    const style = {
      list: {
        marginTop: '50px',
      }
    }

    return (
      <div>
        <AppBar
          title='TorrentVideo'
          iconElementLeft={<IconButton><AvVideoLibrary /></IconButton>}
          iconElementRight={<IconButton onTouchTap={this.logout}><ActionPowerSettingsNew /></IconButton>} />
        <GridList
          cols={6}
          cellHeight={200}
          padding={200}
          style={{width: 2000, height: 720, overflow: 'hidden'}}
        >
          <GridTile cols={2} rows={3} style={{overflowY: 'auto'}}>
            <MovieList items={this.state.items} onUpdate={this.onUpdate} style={style.list} styleListItem={style.listItem} />
          </GridTile>
          <GridTile cols={4} rows={2} style={{marginTop: '200px'}} >
            <Video item={this.state.selectedItem} />
          </GridTile>
        </GridList>
      </div>
    )
  }
})

export default Home
