import openSocket from 'socket.io-client';

const socket = openSocket("http://localhost:3001");

export default socket;