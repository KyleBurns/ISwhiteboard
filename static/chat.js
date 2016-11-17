    var socket = io();

    //Prompt the user to enter a nickname.
    var nick = window.prompt("Enter your nickname","Guest");

    //Send a message to the server indicating that the user has joined.
    socket.emit('chat message', "has joined the server.",nick);
    $('#typing').hide();

    $('form').submit(function(){
      socket.emit('chat message', $('#m').val(), nick);
      $('#m').val('');
      return false;
    });

    //Whenever a key is lifted while a user is typing into the message box, emit a 'typing' message to the server.
    //True if the current form contains characters, and false if empty.
    $("#m").keyup(function(){
      if ($('#m').val() != ''){	
        socket.emit('typing', true);
        }
      else{
        socket.emit('typing', false);	
	}
      return false;
    });

    //When a 'typing' message has been received, show the indicator if true and hide it if false.
    socket.on('typing', function(b){
      if(b == true){
        $('#typing').show();
      }
      else{
        $('#typing').hide();
      }
    });

    //When a message has been sent, make sure to hide the 'typing' indicator.
    socket.on('chat message', function(msg, n){
      $('#messages').append($('<li>').text(n + ": " + msg));
      $('#typing').hide();
    });

