const ranWords = require('./wordsArr');
const express = require('express');
const socket = require('socket.io');
const app = express();
var gamesArr = [];


const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => console.log("Server running on port 3001"));

const io = socket(server, {
    cors: {
      origin: '*',
    }
  });
    
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

const getWords = () => {
    return shuffle(ranWords);
}

console.log(getWords());

io.on('connection', function(socket){
    const sessionID = socket.id;
    socket.on('createRoom', (data) => {
        let nameArr = [];
        nameArr.push(data.name);
        let idArr = [];
        let val = {room: socket.id, names: nameArr, max: data.max, current: 1, closed: false};
        gamesArr.push(val);
        socket.emit('success');
        setTimeout(() => {
            io.to(data.gameCode).emit('userConnection', data.name, val.current, val.max, val.names);
        }, 300);
        console.log(data.name, 'created room:', data.room);
    });
    socket.on('joinRoom', (data) => {
        var invalidCode = 0;
        for(var i = 0; i < gamesArr.length; i++){
            if(gamesArr[i].room === data.gameCode && gamesArr[i].max > gamesArr[i].current && !gamesArr[i].closed){
                socket.join(data.gameCode);
                gamesArr[i].current++;
                gamesArr[i].names.push(data.name);
                socket.emit('success', data.name);
                io.to(data.gameCode).emit('userConnection', data.name, gamesArr[i].current, gamesArr[i].max, gamesArr[i].names, data.gameCode);
                console.log(data.name, 'joined room:', data.gameCode);
            }else if(gamesArr[i].max <= gamesArr[i].current){
                console.log("Room is Full");
            }else{
                invalidCode++;
            }
        }
        if(invalidCode === gamesArr.length){
            console.log("Invalid Code");
        }
    });
    socket.on('mouse', (data, code) => {
        io.to(code).emit('drawing', data);
    });
    socket.on('startedGame', (code) => {
        let setUpArr = {};
        let correctArr = [];
        for(var i = 0; i < gamesArr.length; i++){
            if(gamesArr[i].room === code){
                gamesArr[i].closed = true;
                setUpArr = gamesArr[i];
                setUpArr.words = getWords(gamesArr[i].current);
                for(var j = 0; j < gamesArr[i].names.length; j++){
                    correctArr.push({name: gamesArr[i].names[j], correct: false});
                }
            }
        }
        setUpArr.correct = correctArr;
        io.to(code).emit('redirectToGame', setUpArr);
        console.log("started game");
    })
    socket.on('clearedCanvas', (code) => {
        io.to(code).emit('clearBoard');
    });
    socket.on('guessedCorrect', (code, arr) => {
        io.to(code).emit('guessedRight', arr);
    });
});