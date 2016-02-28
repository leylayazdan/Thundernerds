$(function() {
  var socket = io();

  // Show the modal on page entry
  $('#myModal').modal('show');

  // When the user clicks on send button
  $('#msg-click').click(function(){
    sendMessage();
  });

  // When the user clicks on Start Talking button
  $('#start').on('click', function(e)
  {
    sendTopics();
    socket.emit('start');
  })

  // Or the user presses enter from the text box
  $('#msg').keydown(function(event) {
    if (event.keyCode == 13) {
      sendMessage();
    }
  });

  var sendMessage = function() {
    var $msg = $('#msg');
    var message = $msg.val();
    socket.emit('message', JSON.stringify({message: message}));
    $msg.val('');
  };


  var sendTopics = function() {
    var $topics = $('#topics');
    var topics = $topics.val();
    console.log(topics);
    console.log(topics.length);

    socket.emit('topics', topics);
  }


  // When we receive a user message, add to html list
  socket.on('user-message', function(msg) {
    var new_msg = $('<li>').text(msg);
    $('#messages').append(new_msg);
    $('body,html').animate({scrollTop: $('#messages li:last-child').offset().top + 5 + 'px'}, 5);
  });

  socket.on('count', function(message) { console.log(message); });
});
