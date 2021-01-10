import React, { Component } from "react";
import Sketch from "react-p5";
import socket from '../../socketConfig';

const WIDTH = 0.8 * window.innerWidth;
const HEIGHT = window.innerHeight;

export default class App extends Component {
  state = {
    players: [],
    numPlayers: 1,
    maxPlayers: 0,
    gameCode: this.props.location.state.id
  }
  componentWillUnmount() {
    this.setState = (state,callback)=>{
        return;
    };
  }

  setup = (p5, parent) => {
    p5.createCanvas(WIDTH, HEIGHT).parent(parent);
    p5.background(220,220,220);
    p5.frameRate(120);
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
    return(
    <Sketch setup={this.setup} draw={this.draw} mouseDragged={this.mouseDragged}/>)
  }
} 