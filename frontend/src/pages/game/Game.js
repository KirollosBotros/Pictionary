import React, { Component } from "react";
import Sketch from "react-p5";
import socket from '../../socketConfig';
import BrushIcon from '@material-ui/icons/Brush';

const WIDTH =  window.innerWidth;
const HEIGHT = 0.85 * window.innerHeight;
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
    onTurn: false,
    currentTurn: 0,
    resetTimer: true,
    correct: false,
    correctArr: this.props.location.state.setup.correct,
    guessedWord: '',
    guessedWordSoFar: ''
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
        return;
    };
  }

  componentDidMount = () => {
    if(this.state.resetTimer){
      var start = Date.now();
      setInterval(() => {
        document.getElementById("timer").innerHTML = second;
        var delta = Date.now() - start;
        second = sec - Math.floor(delta/1000);
        if(second === -1){
          socket.emit('clearedCanvas', this.state.gameCode);
          //console.log(this.props.location.state.setup.correct);
          let resetCorrectArr = [];
          for(var i = 0; i < this.state.correctArr.length; i++){
            resetCorrectArr.push({name: this.state.setUpArr.names[i], correct: false});
          }
          this.setState({correctArr: resetCorrectArr});
          if(this.state.currentTurn === this.state.setUpArr.names.length -1){
            this.setState({
              currentTurn: 0,
              resetTimer: true
            });
          }else{
            this.setState({
              currentTurn: this.state.currentTurn + 1,
              resetTimer: true
            });
          }  
          second = timerSeconds;
          start = Date.now();
        }
      }, 100); 
    } 
  }

  onChange = (e) => {
    this.setState({guessedWordSoFar: e.target.value}, () => {
      if(this.state.guessedWordSoFar === this.state.setUpArr.words[this.state.currentTurn]){
        console.log("True");
        let newCorrectArr = [];
        for(var i = 0; i < this.state.correctArr.length; i++){
          if(this.state.correctArr[i].name === this.state.name){
            newCorrectArr.push({name: this.state.name, correct: true});
          }else{
            newCorrectArr.push(this.state.correctArr[i]);
          }
        }
        console.log(newCorrectArr);
        /** for(var i = 0; i < 7; i++){
          if(i === 6){
            newArr.push(newCorrectArr);
          }else{
            newArr.push(this.state.setUpArr[i]);
          }
        } **/
        socket.emit('guessedCorrect', this.state.gameCode, newCorrectArr);
      }else{
        this.setState({correct: false}, () => {
          console.log(this.state.correct);
        })
      }
    });
  }

  submitGuess = (e) => {
    e.preventDefault();
    this.setState({guessedWord: this.state.guessedWordSoFar});
    if(this.state.guessedWord === this.state.setUpArr.words[this.state.currentTurn]){
      this.setState({correct: true});
      console.log(this.state.current);
    }
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

    socket.on('guessedRight', (arr) => {
      this.setState({correctArr: arr});
      //this.setState({setUpArr: arr});
      //console.log(this.state.correctArr);
    });
  }
    
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
    const getColour = (Name) => {
      if(this.state.setUpArr.names[this.state.currentTurn] === Name){
        return '#e6ed15';
      }else{
        for(var i = 0; i < this.state.correctArr.length; i++){
          if(this.state.correctArr[i].name === Name){
            if(this.state.correctArr[i].correct){
              return '#1ae310';
            }else{
              return '#acb5ac';
            }
        }
      }
    }
  }

    const styleTable = (name) => {
      return {backgroundColor: getColour(name),
              padding: '10px',
              margin: '10px',
              borderRadius: '8px',
              width: (WIDTH-150)/this.state.setUpArr.names.length,
              textAlign: 'center',
              float: 'left'}
    }
    const formStyle = {
      display: 'inline-block',
      position: 'absolute',
      top: '94%',
      left: '43%'
    }
    //console.log(this.state.setUpArr);
    var list = [];
    for(var i = 0; i < this.state.setUpArr.names.length; i++){
      list.push(<div key={i}><h4 style={styleTable(this.state.setUpArr.names[i])}>{this.state.setUpArr.names[i]+' '}<BrushIcon style = {{marginBottom: '4px'}} /></h4></div>);
    }
    return( <div>
      <div>
      {list}
      <span style={{userSelect: 'none', float: 'right', marginRight: '25px', marginTop: '13px', fontSize: '30px',fontFamily: 'Arial, Helvetica, sans-serif'}} id="timer"></span>
      </div>
      <Sketch setup={this.setup} draw={this.draw} mouseDragged={this.mouseDragged} keyTyped={this.keyTyped}/>   
      <br></br>
      <div style={formStyle} className="form-inline">
        <input onChange={this.onChange} style={{width: '230px'}} className="form-control" aria-describedby="emailHelp" placeholder="Enter word" type="text" />
        <button onClick={this.submitGuess} style={{marginLeft: '8px'}} type="submit" className="btn btn-primary">Guess</button>
      </div>
    </div>)
  }
} 