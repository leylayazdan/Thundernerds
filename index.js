var app = require('express')();
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;
var gravatar = require('gravatar');

// var avatar = gravatar.url('email_goes_here', { w:64, h:64});

var SYSTEM = 'System';

var fs = require('fs');
var util = require('util');
function inspect(o, d)
{
  console.log(util.inspect(o, { colors: true, depth: d || 1 }));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve our index.html page at the root url
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

//Writes feedback to a file
app.post('/feedback', function(req, res)
{
  //TODO: Better file names or send actual email/store to DB
  var filename = 'feedback_' + Math.random().toString() + '.json';
  console.log('Saving feedback to ' + filename);
  fs.writeFile(filename, JSON.stringify(req.body), { encoding: 'utf8'}, function(err, done)
  {
    res.end();
  });
});

// Have express serve all of our files in the public directory
app.use(express.static('public'));

// Code in this block is run every time a new socketIO connection is made
io.on('connection', function (socket) {
  io.emit('count', io.sockets.sockets.length);
  // socket.id is a unique id for each socket connection
  socket.on('topics', function(message) {
    console.log("topics:", message);
    socket.topics = message;
  });

  socket.on('start', function()
  {
    if(!socket.topics) {
      socket.emit('user-message', "Use 'topics' ... to set the conversation topics");
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
    });

    if (clientsWithMatchingTopics.length <= 0) {
      socket.emit('user-message', encodeMessage("Sorry. We couldn't find a match for " + socket.topics +
          ". \n You can wait for someone or try these suggestions: anxious, depressed, insecure, lonely, powerless, stressed", SYSTEM));
      return;
    }

    var matchedClient = clientsWithMatchingTopics[0];
    var matchedTopic = matchingTopics[0];
    var random = Math.random().toString(); //Get something better, like a UUID
    matchedClient.join(random);
    socket.join(random);
    matchedClient.room = random;
    socket.room = random;
    io.to(random).emit('user-message', encodeMessage('You are talking about ' + matchedTopic + ' with ' + socket.id, SYSTEM));
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
