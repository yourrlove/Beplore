const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5000',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

// Keep track of connected clients and their socket IDs
const connectedClients = {};

io.on('connection', (socket) => {
  // Store the socket ID of the connected client
  console.log('a user connected', socket.id);
  const userId = socket.handshake.query.userId;
  if(userId != "undefined") {
    connectedClients[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(connectedClients));
  socket.on('disconnect', () => {
    delete connectedClients[userId];
    console.log(`Socket disconnected: ${socket.id}`);
  });
});


module.exports = {
    server,
    io,
    app,
    connectedClients
}