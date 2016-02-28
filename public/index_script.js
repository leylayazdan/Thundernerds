$('#myModal').modal({show: true, backdrop: 'static', keyboard:false});

$(function() {
  var socket = io();
  var accumulator = 1;

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
  });


  /*
  $('#no-topic').on('click', function(e)
  {
    sendTopic2();
    socket.emit('start');
  });

  $('#no-topic2').on('click', function(e)
  {
    sendTopic3();
    socket.emit('start');
  });
  */

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
  };

  /*
  var sendTopic2 = function() {
    var $topic2 = $('#topic2');
    var topic2 = $topic2.val();

    socket.emit('topic2', topic2);
  };

  var sendTopic3 = function() {
    var $topic3 = $('#topic3');
    var topic3 = $topic3.val();

    socket.emit('topic3', topic3);
  };
  */
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
  });

  //$('#feedback').on('submit', function() {
  //  $('#feedback').attr('action',
  //      'mailto:matyar33@gmail.com?subject=' +
  //      $('#name').val() + '&body=' + $('#email').val() + $('#feedbackMessage').val());
  //  $('#feedback').submit();
  //});

  socket.on('count', function(message) { console.log(message); });

  var $feedback = $('#feedback');

  $feedback.on('submit', function(e)
  {
    $.post('/feedback', $feedback.serialize(), function(err, done){
      //Clear form
      //If err - show error
      console.log(err, done);
      if(err) { alert(err); }
      $feedback.get(0).reset();
      $('#submitButton').attr('disabled', true).val('Thank you');
    });
    e.preventDefault();
    e.stopPropagation();
  });
});