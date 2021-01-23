import openSocket from 'socket.io-client';

const socket = openSocket("https://pictionary-backend-server.herokuapp.com/");

// for local development:
//const socket = openSocket("http://localhost:3001");

export default socket;