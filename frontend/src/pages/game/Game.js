import React, { Component } from "react";
import Sketch from "react-p5";
import socket from '../../socketConfig';

const WIDTH =  window.innerWidth;
const HEIGHT = window.innerHeight - 100;
const timerSeconds = 20;
var sec = timerSeconds;
var second = timerSeconds;

export default class App extends Component {
  state = {
    players: [],
    name: this.props.location.state.name,
    numPlayers: 1,
    maxPlayers: 0,
    gameCode: this.props.location.state.id,
    setUpArr: this.props.location.state.setup,
    turnDone: false,
    currentTurn: 0,
    resetTimer: true,
    correct: false
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
        return;
    };
  }

  setup = (p5, parent) => {
    p5.createCanvas(WIDTH, HEIGHT).parent(parent);
    p5.background(220,220,220);

    socket.on('drawing', (data) => {
      p5.ellipse(data.x, data.y, 25, 25);
      p5.noStroke();
      p5.fill(0);
    });

    socket.on('clearBoard', () => {
      p5.clear();
      p5.background(220,220,220);
    });

    if(this.state.resetTimer){
      if(this.state.resetTimer){
        var start = Date.now();
        setInterval(() => {
          document.getElementById("timer").innerHTML = second;
          var delta = Date.now() - start;
          second = sec - Math.floor(delta/1000);
          if(second === -1){
            socket.emit('clearedCanvas', this.state.gameCode);
            console.log(this.state.setUpArr.names[this.state.currentTurn]);
            this.setState({
              currentTurn: this.state.currentTurn + 1,
              resetTimer: true
            });
            second = timerSeconds;
            start = Date.now();
          }
        }, 100); 
      } 
    } 
  }


      /**setInterval(function() {
        document.getElementById("timer").innerHTML = sec;
        sec--;
        if(sec === -1){
          socket.emit('clearedCanvas', this.state.gameCode);
          this.setState({
            currentTurn: this.state.currentTurn + 1,
            resetTimer: true
          });
          console.log(this.state.setUpArr.names[this.state.currentTurn]);
          sec = 20;
        }
      }.bind(this), 1000);**/
    

  draw = p5 => {
  }

  keyTyped = p5 => {
    if(p5.key === 'c' && this.state.setUpArr.names[this.state.currentTurn] === this.state.name){
      socket.emit('clearedCanvas', this.state.gameCode);
      p5.clear();
      p5.background(220,220,220);
    }
  }

  mouseDragged = p5 => {
    if(this.state.setUpArr.names[this.state.currentTurn] === this.state.name){
      p5.ellipse(p5.mouseX, p5.mouseY, 25, 25);
      p5.noStroke();
      p5.fill(0);
      var positions = {
        x: p5.mouseX,
        y: p5.mouseY
      }
      socket.emit('mouse', positions, this.state.gameCode);
    }
  }

  render() {
    const styleTable = {
      backgroundColor: '#f3f3f3',
      padding: '10px',
      margin: '10px',
      borderRadius: '8px',
      width: (WIDTH-130)/this.state.setUpArr.names.length,
      textAlign: 'center',
      float: 'left'
    }
    console.log(this.state.setUpArr);
    var list = [];
    for(var i = 0; i < this.state.setUpArr.names.length; i++){
      list.push(<h4 key={i} style={styleTable}>{this.state.setUpArr.names[i]}</h4>);
    }
    return( <div>
    <div>
     {list}
     <span style={{userSelect: 'none', float: 'right', marginRight: '25px', marginTop: '9px', fontSize: '30px',fontFamily: 'Arial, Helvetica, sans-serif'}} id="timer"></span>
    </div>
    <Sketch setup={this.setup} draw={this.draw} mouseDragged={this.mouseDragged} keyTyped={this.keyTyped}/>
 </div>)
  }
} 