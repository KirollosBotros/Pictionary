import React, { Component } from "react";
import socket from '../../socketConfig';
import {Redirect} from 'react-router-dom';

var first = true;

export default class App extends Component {
  state = {
    players: [],
    numPlayers: 1,
    maxPlayers: 0,
    gameCode: socket.id,
    redir: false,
    setUp: []
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
        return;
    };
  }

  startGame = () => {
    socket.emit('startedGame', this.state.gameCode);
  }

  render() {
    socket.on('userConnection', (name, num, max, names, code) => {
        console.log(name, "joined");
        this.setState({
          players: names,
          numPlayers: num,
          maxPlayers: max,
          gameCode: code
        });
    });

    socket.on('redirectToGame', (setUpArr) => {
      this.setState({
        setUp: setUpArr,
        redir: true
      });
    });

    var list = [];
    for (var i = 0; i < this.state.players.length; i++){
      list.push(<h2 key={i}>{this.state.players[i]}{" joined\n"}</h2>);
    }
    
    let gameCodeDisplay = 
      <div style={{textAlign: 'center'}}>
      <h2>Game Code:</h2>
      <h3>{this.state.gameCode}</h3>
      </div> 

    let numPeople = 
      !this.props.creator || first === false ? 
      <h2 style={{textAlign: 'center', marginRight: '15px', marginTop: '11px'}}>
        {this.state.numPlayers + '/' + this.state.maxPlayers + ' player(s) in the room'}
      </h2> : 
      <h2 style={{textAlign: 'center', marginRight: '15px', marginTop: '11px'}}>{1 + '/' + this.props.max + ' player(s) in the room'}</h2>
    
    if(this.state.redir){
        return <Redirect to={{
                    pathname: '/game',
                    state: { 
                      id: this.state.gameCode,
                      setup: this.state.setUp,
                      name: this.props.playerName
                    }
                }}
                />
    }else if(this.props.creator && !first) {
        return <div>
                {gameCodeDisplay} 
                {numPeople}
                <button onClick={this.startGame} to='/game' type="button" style={{display:'block', margin: 'auto', width: '150px' }} className="btn btn-success">Start Game</button>
                <hr></hr>   
                {list}{"\n"}  
             </div>
    }else if(!this.props.creator || first === false){
      return <div>
                {gameCodeDisplay} 
                {numPeople}
                <button onClick={this.startGame} to='/game' type="button" style={{display:'block', margin: 'auto', width: '150px' }} className="btn btn-success">Start Game</button>
                <hr></hr>   
                {list}{"\n"}  
             </div>
    }else{
      first = false;
      return <div>
                {gameCodeDisplay} 
                {numPeople}
                <button onClick={this.startGame} to='/game' type="button" style={{display:'block', margin: 'auto', width: '150px' }} className="btn btn-success">Start Game</button>
                <hr></hr>   
                <h2>{this.props.creatorN + ' joined\n'}</h2>
              </div>
    } 
  } 
} 