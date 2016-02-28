$('#myModal').modal({show: true, backdrop: 'static', keyboard:false});

function callback() {
  // Find modal body on the document
  var $currentDetailsModal = $('#noTopicsModal');

  // Clone modal and save copy
  var $cloneDetailsModal = $currentDetailsModal.clone();

  // Find links in this modal which open this modal again and bind this function to their click events
  $('#topic-click2', $cloneDetailsModal).click(callback);
}

$(function() {
  var socket = io();
  var accumulator = 1;

  // When the user clicks on send button
  $('#msg-click').click(function(){
    sendMessage();
  });

  // When the user clicks on submit topic button
  $('#topic-click').click(function(){
    sendTopic();
  });

  $('#start').on('click', function(e)
  {
    socket.emit('start');
  });

  // When the user clicks on submit topic button
  $('#topic-click2').click(function(){
    sendTopic2();
  });

  // When the user clicks on submit topic button
  $('#topic-click3').click(function(){
    sendTopic3();
  });

  $('#no-topic').on('click', function(e) {
    socket.emit('start');
  });

  $('#no-topic2').on('click', function(e) {
    socket.emit('start');
  });

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


    //

    $msg.val('');
  };


  var sendTopic = function() {
    var $topic = $('#topic');
    var topic = $topic.val();

    socket.emit('topic', topic);
  };

  var sendTopic2 = function() {
    var $topic = $('#topic2');
    var topic = $topic.val();

    socket.emit('topic2', topic);
  };

  var sendTopic3 = function() {
    var $topic = $('#topic3');
    var topic = $topic.val();

    socket.emit('topic3', topic);
  };

  // When we receive a user message, add to html list
  socket.on('user-message', function(msg) {
    var new_msg = $('<li>').text(msg);
    $('#messages').append(new_msg);
    $('body,html').animate({scrollTop: $('#messages li:last-child').offset().top + 5 + 'px'}, 5);
  });

  socket.on('notopic', function() {
    if (accumulator % 2 != 0) {
      $("#noTopicsModal").modal({show: true, backdrop: 'static', keyboard:false});
    } else {
      $("#noTopicsModal2").modal({show: true, backdrop: 'static', keyboard:false});
    }
    accumulator++;
    /*if (accumulator >= 1) {
      $("#noTopicsModal").modal('hide');
      console.log("are you incrementing?");
    }
    console.log("But do I get here");
    $("#noTopicsModal").modal('toggle');
    accumulator++;
    console.log("WHYAREYOUNOTWORKING")
    */
  });

  socket.on('count', function(message) { console.log(message); });
});
