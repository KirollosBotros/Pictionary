import React, { Component } from "react";
import Sketch from "react-p5";
import socket from '../../socketConfig';

const WIDTH =  window.innerWidth;
const HEIGHT = window.innerHeight - 72;

export default class App extends Component {
  state = {
    players: [],
    numPlayers: 1,
    maxPlayers: 0,
    gameCode: this.props.location.state.id,
    setUpArr: this.props.location.state.setup
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
  }

  draw = p5 => {

  }

  mouseDragged = p5 => {
    p5.ellipse(p5.mouseX, p5.mouseY, 25, 25);
    p5.noStroke();
    p5.fill(0);
    var positions = {
      x: p5.mouseX,
      y: p5.mouseY
    }
    socket.emit('mouse', positions, this.state.gameCode);
  }
  
  render() {
    const styleTable = {
      backgroundColor: '#f3f3f3',
      padding: '10px',
      margin: '10px',
      borderRadius: '8px',
      width: WIDTH/this.state.setUpArr.names.length - 25,
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
    </div>
    <Sketch setup={this.setup} draw={this.draw} mouseDragged={this.mouseDragged}/>
 </div>)
  }
} 