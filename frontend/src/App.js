import React, { Component } from 'react';
import {BrowserRouter as Router, Redirect, Route} from 'react-router-dom';
import JoinForm from './pages/JoinForm';
import CreateGame from './pages/CreateGame';
import WelcomePage from './pages/WelcomePage';
import Lobby from './pages/game/Lobby';
import Game from './pages/game/Game';
import socket from './socketConfig';

export class App extends Component {
  state = {
    redirect: false,
    isCreator: true,
    maxNum: 1,
    creatorName: ''
  }

  create = (playerName, maxPlayers) => {
    socket.emit('createRoom', {room: socket.id, name: playerName, max: maxPlayers});
    socket.on('success', () => {
      this.setState({
        redirect: true,
        maxNum: maxPlayers,
        creatorName: playerName
      });      
    });
  } 

  join = (room, playerName) => {
    socket.emit('joinRoom', {gameCode: room, name:playerName});
    socket.on('success', (playerName) => {
      this.setState({
        redirect: true,
        isCreator: false
      });      
    });
  }

  render() {
    return (
      <Router>
        {this.state.redirect ? <Redirect to='/lobby'></Redirect> : null}
        <div>
        <Route exact path="/" component={WelcomePage}/>
        <Route exact path="/game" component={Game}/>

        <Route
          exact path="/join-game"
          render={(props) => (
            <JoinForm join={this.join}/>
          )}/>
        <Route
          exact path="/create-game"
          render={(props) => (
            <CreateGame create={this.create}/>
          )}/>
          <Route
          exact path="/lobby"
          render={(props) => (
            <Lobby creator={this.state.isCreator} 
                  max={this.state.maxNum}
                  creatorN={this.state.creatorName} />
          )}/>
        </div>
      </Router>
    )
  }
}

export default App