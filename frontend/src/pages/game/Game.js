// Basic imports
import React, { Component } from "react";
import Sketch from "react-p5";
import socket from '../../socketConfig';

// Material-UI imports
import BrushIcon from '@material-ui/icons/Brush';
import CheckIcon from '@material-ui/icons/Check';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';

// Constants for inital setup
const WIDTH = window.innerWidth;
const HEIGHT = 0.80 * window.innerHeight;

// Constants for timer setup
const timerSeconds = 60;
var start = Date.now();
var sec = timerSeconds;
var second = timerSeconds;

export default class App extends Component {
  // state for the whole game logic and dynamic rendering
  state = {
    players: [],
    name: this.props.location.state.name,
    numPlayers: 1,
    maxPlayers: 0,
    gameCode: this.props.location.state.id,
    setUpArr: this.props.location.state.setup,
    onTurn: false,
    currentTurn: 0,
    wordNumber: 0,
    resetTimer: true,
    correct: false,
    correctArr: this.props.location.state.setup.correct,
    guessedWord: '',
    guessedWordSoFar: '',
    list: this.props.location.state.initialList,
    first: true
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
        return;
    };
  }

  // Display the initial headings of names
  componentWillMount = () => {
    this.updateList();
  }

  // Timer logic
  componentDidMount = () => {
    if(this.state.resetTimer){
      start = Date.now();

      setInterval(() => {
        document.getElementById("timer").innerHTML = second;
        var delta = Date.now() - start;
        second = sec - Math.floor(delta/1000);

        // When timer resets:
        if(second === -1){
          console.log("reached");

          // Clear the board for all players
          socket.emit('clearedCanvas', this.state.gameCode);
          let resetCorrectArr = [];

          for(var i = 0; i < this.state.correctArr.length; i++){
            resetCorrectArr.push({name: this.state.setUpArr.names[i], correct: false});
          }

          // Everyone except the creator will have their names go back to default colour
          this.setState({correctArr: resetCorrectArr}, this.updateList);

          // If it's the last player's turn, reset the state, but make the first player the next player
          if(this.state.currentTurn === this.state.setUpArr.names.length - 1){
            this.setState({
              currentTurn: 0,
              wordNumber: this.state.wordNumber + 1,
              resetTimer: true
            }, this.updateList);
          }else{

            // Otherwise increment the current player by 1
            this.setState({
              currentTurn: this.state.currentTurn + 1,
              wordNumber: this.state.wordNumber + 1,
              resetTimer: true
            }, this.updateList);
          } 

          // Reset the clock back to 60 seconds
          second = timerSeconds;
          start = Date.now();
        }
      }, 100); 
    } 
  }

  // Called everytime a player (guesser) hits a key stroke
  onChange = (e) => {
    
    // set the state of the current guessed word and AFTER that, run check logic
    this.setState({guessedWordSoFar: e.target.value}, () => {
      
      // If the player guessed right...
      if(this.state.guessedWordSoFar === this.state.setUpArr.words[this.state.wordNumber]){
        console.log("True");
        let newCorrectArr = [];
        
        // Create a new array with the player that guessed correct's status as 'correct'
        for(var i = 0; i < this.state.correctArr.length; i++){
          if(this.state.correctArr[i].name === this.state.name){
            newCorrectArr.push({name: this.state.name, correct: true});
          }else{
            newCorrectArr.push(this.state.correctArr[i]);
          }
        } 

        // Send to the server the updated correct status array
        socket.emit('guessedCorrect', this.state.gameCode, newCorrectArr);
      }else{
        this.setState({correct: false});
      }
    });
  }
 
  // p5.js logic for canvas - called only once at the start of the program
  setup = (p5, parent) => {
    var cnv = p5.createCanvas(WIDTH, HEIGHT).parent(parent);
    p5.background(220,220,220);

    // socket event listener for when a drawing is recieved
    socket.on('drawing', (data) => {
      p5.ellipse(data.x, data.y, 25, 25);
      p5.noStroke();
      p5.fill(0);
    });

    // socket event listener for when the board is cleared
    socket.on('clearBoard', () => {
      p5.clear();
      p5.background(220,220,220);
    });

    // socket event listener for when a user guesses the correct word
    socket.on('guessedRight', (arr) => {
      let count = 0;
      
      // update the correct list once the new correct array has been set in state
      this.setState({correctArr: arr}, this.updateList);
      
      for(var i = 0; i < arr.length; i++){
        if(arr[i].correct){
          count++;
        }
      }

      console.log("How many correct" + count);
      console.log(arr.length);

      // If all players guessed corret, then reset the board and move on to the next player
      if(count === arr.length - 1){
        setTimeout(() => {

          // Clear the board
          socket.emit('clearedCanvas', this.state.gameCode);
          let resetCorrectArr = [];
          
          for(var i = 0; i < this.state.correctArr.length; i++){
            resetCorrectArr.push({name: this.state.setUpArr.names[i], correct: false});
          }
          
          this.setState({correctArr: resetCorrectArr}, this.updateList);
          
          // If it was the last players turn, reset state but make the first player the next turn
          if(this.state.currentTurn === this.state.setUpArr.names.length - 1){
            this.setState({
              currentTurn: 0,
              wordNumber: this.state.wordNumber + 1,
              resetTimer: true
            }, this.updateList);
          }else{

            // Otherwise make the next person in the array the new creator
            this.setState({
              currentTurn: this.state.currentTurn + 1,
              wordNumber: this.state.wordNumber + 1,
              resetTimer: true
            }, this.updateList);
          }  
          
          // reset timer
          second = timerSeconds;
          start = Date.now();
        }, 500);
      }
    });
  }
    
  draw = p5 => {
  }

  // p5.js integrated function called whenever a key is pressed
  keyTyped = p5 => {
    
    // if the CREATOR presses 'c', clear the board for every user
    if(p5.key === 'c' && this.state.setUpArr.names[this.state.currentTurn] === this.state.name){
      socket.emit('clearedCanvas', this.state.gameCode);
      p5.clear();
      p5.background(220,220,220);
    }
  }

  // Integrated p5.js function called when mouse is dragged on canvas
  mouseDragged = p5 => {

    // if and only if the creator is dragging the mouse, create a drawing and emit to server
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

  // Keep track of who guessed correct for dynamic styling
  updateList = () => {
    var tempList = [];
    
    // Return the styling for the header of each person in the array based on creator/correct status
    for(var i = 0; i < this.state.setUpArr.names.length; i++){
      if(i === this.state.currentTurn){
        tempList.push(<div key={i}><h4 style={this.styleTable(this.state.setUpArr.names[i])}>{this.state.setUpArr.names[i]+' '}<BrushIcon style = {{marginBottom: '4px', marginLeft: '9px'}} /></h4></div>);
      }else if(this.state.correctArr[i].correct){
        console.log(this.state.correctArr[i].correct);
        tempList.push(<div key={i}><h4 style={this.styleTable(this.state.setUpArr.names[i])}>{this.state.setUpArr.names[i]+' '}<CheckIcon style = {{marginBottom: '4px', marginLeft: '5px'}} /></h4></div>);
      }else{
        tempList.push(<div key={i}><h4 style={this.styleTable(this.state.setUpArr.names[i])}>{this.state.setUpArr.names[i]+' '}<HourglassEmptyIcon style = {{marginBottom: '4px', marginLeft: '5px'}} /></h4></div>);
      }
    }
    this.setState({list: tempList});
  }

  // constant for styling the name headers
  styleTable = (name) => {
    let newStyles = {
      backgroundColor: this.getColour(name),
      padding: '10px',
      margin: '10px',
      borderRadius: '8px',
      width: (WIDTH - (20 * (this.state.setUpArr.names.length + 1)) - 55)/ this.state.setUpArr.names.length,
      textAlign: 'center',
      float: 'left'
    }

    return newStyles;
  }

  // function to determine what colour the background of the header would be based on creator/correct status
  getColour = (nameOfPlayer) => {
    if(this.state.setUpArr.names[this.state.currentTurn] === nameOfPlayer){
      return '#e6ed15';
    }else{
      for(var i = 0; i < this.state.correctArr.length; i++){
        if(this.state.correctArr[i].name === nameOfPlayer){
          if(this.state.correctArr[i].correct){
            return '#1ae310';
          }else{
            return '#acb5ac';
          }
        }
     }
    }
  }

  // Main render method in React component
  render() {

    // Used for testing purposes (no impact on game for now)
    const getCorrect = (name) => {
      for(var i = 0; i < this.state.setUpArr.names.length; i++){
        if(this.state.correctArr[i].name === name){
          if(this.state.correctArr[i].correct){
            return true;
          }else{
            return false;
          }
        }
      }
    }

    // Constant for styling the form
    const formStyle = {
      display: 'inline-block',
      position: 'absolute',
      top: '94%',
      left: '43%',
      margin: 'auto'
    }    

    // If the player is the current painter, display the word to draw at the bottom
    if(this.state.setUpArr.names[this.state.currentTurn] === this.state.name){
      return(<div>
              <div>
                {this.state.list}
                <span style={{userSelect: 'none', float: 'right', marginRight: '25px', marginTop: '13px', fontSize: '30px',fontFamily: 'Arial, Helvetica, sans-serif'}} id="timer"></span>
              </div>
              <Sketch setup={this.setup} draw={this.draw} mouseDragged={this.mouseDragged} keyTyped={this.keyTyped}/>   
              <h2 style={{textAlign:'center'}}>Your word to draw is: <b>{this.state.setUpArr.words[this.state.wordNumber]}</b></h2>
            </div>);
    }else{

      // Otherwise, display a textbox to take input as guesses from players
      return(<div>
              <div>
                {this.state.list}
                <span style={{userSelect: 'none', float: 'right', marginRight: '25px', marginTop: '13px', fontSize: '30px',fontFamily: 'Arial, Helvetica, sans-serif'}} id="timer"></span>
              </div>
              <Sketch setup={this.setup} draw={this.draw} mouseDragged={this.mouseDragged} keyTyped={this.keyTyped}/>   
              <br></br>
              <div style={formStyle} className="form-inline">
                <input onChange={this.onChange} style={{width: '230px'}} className="form-control" aria-describedby="emailHelp" placeholder="Enter word" type="text" />
              </div>
            </div>);
    }
  }
}