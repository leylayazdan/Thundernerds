var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;
var gravatar = require('gravatar');

// var avatar = gravatar.url('email_goes_here', { w:64, h:64});

var SYSTEM = 'System';

var util = require('util');
function inspect(o, d)
{
  console.log(util.inspect(o, { colors: true, depth: d || 1 }));
}

// Serve our index.html page at the root url
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// Have express serve all of our files in the public directory
app.use(express.static('public'));

// Code in this block is run every time a new socketIO connection is made
io.on('connection', function (socket) {
  io.emit('count', io.sockets.sockets.length);
  // socket.id is a unique id for each socket connection
  socket.on('topic', function(message)
  {
    console.log("Topic:", message);
    socket.topic = message;
  });

  socket.on('start', function()
  {
    // if(!socket.topic)
    // {
    //   socket.emit('user-message', "Use 'topic' ... to set the conversation topic");
    // }
    //Go over all connected clients
    //see if their topics match
    //join them into a room

    var matching = io.sockets.sockets.filter(function(client)
    {
      if(client === socket) return false;
      if(client.room) return false;
      return client.topic && client.topic === socket.topic;
    });

    if(matching.length <= 0)
    {
      // TODO: Change 'user-message' to 'error'?
      socket.emit('user-message', encodeMessage('Nobody is interested in ' + socket.topic, SYSTEM));
      return;
    }

    var match = matching[0];
    var random = Math.random().toString(); //Get something better, like a UUID
    match.join(random);
    socket.join(random);
    match.room = random;
    socket.room = random;
    io.to(random).emit('user-message', encodeMessage('You are talking about ' + match.topic + ' with ' + socket.id, SYSTEM));
    // socket.emit('user-message', 'You are talking about ' + socket.topic + ' with ' + match.id);
  });

  function encodeMessage(message, sender)
  {
    return JSON.stringify({
      message: message,
      sender: sender,
      // avatar: avatar
    });
  }

  console.log(socket.id + ' connected');

  // The following two declarations create handlers for
  // socket events on this specific connection

  // You can do something when the connection disconnects
  socket.on('disconnect', function(){
    console.log(socket.id + ' disconnected');
    io.emit('count', io.sockets.sockets.length);
  });

  // message is our custom event, emit the message to everyone
  socket.on('message', function(msg) {
    var data = JSON.parse(msg);
    console.log("Message: ", data);
    if(socket.room)
    {
      io.to(socket.room).emit('user-message', encodeMessage(data.message, socket.id));
    }
    else
    {
      // io.emit('user-message', socket.id + ": " + data.message);
    }
  });
});

// Starts the web server at the given port
http.listen(port, function(){
  console.log('Listening on ' + port);
});
