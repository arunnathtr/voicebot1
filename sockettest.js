// Import express and socket.io modules
var express = require('express');
var socket = require('socket.io');

// Create an express app
var app = express();

// Serve static files from the public folder
app.use(express.static('public'));

// Create a server and listen on port 3000
var server = app.listen(process.env.PORT, function() {
  console.log('Listening on port 3000');
});

// Create a socket.io instance using the server
// var io = socket(server);

const io = require('socket.io')(server, {
    allowEIO3: true,
    cors: {
//      origin: '*',
      origin: 'http://localhost:8080',
      credentials: true,
    }
  });
  

// Handle connection event
io.on('connection', function(socket) {
  console.log('A user connected: ' + socket.id);

  // Handle custom event
  socket.on('chat', function(data) {
    // Broadcast data to all sockets
    io.sockets.emit('chat', data);
  });
});
