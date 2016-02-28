var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;

var util = require('util');
function inspect(o, d)
{
  console.log(util.inspect(o, { colors: true, depth: d || 1 }));
}

// Serve our index.html page at the root url
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/clients', function(req, res){
  inspect(io.sockets, 4);
  // res.write(JSON.stringify(clients));
  res.end();
})

// Have express serve all of our files in the public directory
app.use(express.static('public'));

// Code in this block is run every time a new socketIO connection is made
io.on('connection', function (socket) {
  io.emit('count', io.sockets.sockets.length);
  // socket.id is a unique id for each socket connection
  socket.on('topics', function(message)
  {
    console.log("topics:", message);
    socket.topics = message;
  });

  socket.on('start', function()
  {
    if(!socket.topics)
    {
      socket.emit('user-message', "Use /topics ... to set the conversation topics");
    }
    //Go over all connected clients
    //see if their topics match
    //join them into a room

var socketTopics = socket.topics;
var clients = io.sockets.sockets;
var clientsWithMatchingTopics = [];
var matchingTopics = [];

socketTopics.forEach(function(socketTopic) {
  clients.forEach(function(client) {
    if (client === socket) return;
    if (client.room) return;
    if (client.topics) {
      client.topics.forEach(function(clientTopic) {
        if (clientTopic === socketTopic) {
          clientsWithMatchingTopics.push(client);
          matchingTopics.push(clientTopic);
        }
      })
    }
  })
})
    if(clientsWithMatchingTopics.length <= 0)
    {
      socket.emit('user-message', 'Nobody is interested in ' + socket.topics);
      return;
    }

    var matchedClient = clientsWithMatchingTopics[0];
    var matchedTopic = matchingTopics[0];
    var random = Math.random().toString(); //Get something better, like a UUID
    matchedClient.join(random);
    socket.join(random);
    matchedClient.room = random;
    socket.room = random;
    io.to(random).emit('user-message', 'You are talking about ' + matchedTopic + ' with ' + socket.id);
    // socket.emit('user-message', 'You are talking about ' + socket.topics + ' with ' + match.id);
  });

  console.log(socket.id + ' connected');

  // The following two declarations create handlers for
  // socket events on this specific connection

  // You can do something when the connection disconnects
  socket.on('disconnect', function(){
    console.log(socket.id + ' disconnected');
    io.emit('count', io.sockets.sockets.length);
  });

  // message is our custom event, emit the message to everyone in the room
  socket.on('message', function(msg) {
    var data = JSON.parse(msg);
    console.log("Message: ", data);
    if(socket.room)
    {
      io.to(socket.room).emit('user-message', "[Private]: " + data.message);
    }
    else {
      // io.emit('user-message', socket.id + ": " + data.message);
    }
  });
});

// Starts the web server at the given port
http.listen(port, function(){
  console.log('Listening on ' + port);
});
