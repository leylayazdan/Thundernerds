$('#myModal').modal('show');

$(function() {
  var socket = io();

  // When the user clicks on send button
  $('#msg-click').click(function(){
    sendMessage();
  });

  // When the user clicks on Start Talking button
  $('#start').on('click', function(e)
  {
    sendTopic();
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


  var sendTopic = function() {
    var $topic = $('#topic');
    var topic = $topic.val();

    socket.emit('topic', topic);
  }


  // When we receive a user message, add to html list
    socket.on('user-message', function(msg) {
      var new_msg = $('<li>').text(msg);
        console.log(new_msg);
        if (new_msg[0].innerHTML.indexOf(socket.id) > -1) {
            new_msg.attr('id', 'mine');
            $('#messages').append(new_msg)
        } else {
            new_msg.attr('id', 'you');
            $('#messages').append(new_msg);
          }
    $('body,html').animate({scrollTop: $('#messages li:last-child').offset().top + 5 + 'px'}, 5);
  });

  socket.on('count', function(message) { console.log(message); });
});
