import openSocket from 'socket.io-client';

const socket = openSocket("https://pictionary-backend-server.herokuapp.com/");

export default socket;