var SYSTEM = 'System';
var MINE = 'mine';
var YOU = 'you';

$(function() {

  var $messages = $('#messages');
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


  // When we receive a user message, add to html list
    socket.on('user-message', function(msg)
    {
      var data = JSON.parse(msg);
      var owner;
      console.log(data);
      if(data.sender === SYSTEM)
      {
        owner = 'system';
      }
      else {
        owner = data.sender === socket.id ? MINE : YOU;
      }

      if($messages.children().last().hasClass(owner))
      {
        $messages.children().last().find('p').append($('<div>' + data.message + '</div>'));
      }
      else
      {
        var new_msg = $('#messageTemplate_' + owner)
          .clone()
          .attr('id', null)
          .attr('style', null)
          .addClass(owner);
        new_msg.find('.media-body h4').text(data.sender);
        new_msg.find('p').append($('<div>').text(data.message));
        // new_msg.find('img').attr('src', data.avatar);
        $messages.append(new_msg);
      }
      $('body,html').animate({scrollTop: $('#messages div:last-child').offset().top + 5 + 'px'}, 5);
  });
  
  socket.on('notopic', function() {
    if (accumulator % 2 != 0) {
      $("#noTopicsModal").modal({show: true, backdrop: 'static', keyboard:false});
    } else {
      $("#noTopicsModal2").modal({show: true, backdrop: 'static', keyboard:false});
    }
    accumulator++;
  });
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
