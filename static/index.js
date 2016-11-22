var socket = io.connect();

$( "form" ).submit(function( event ) {
	socket.emit('join', $('#id').val(), $('#name').val());
});
