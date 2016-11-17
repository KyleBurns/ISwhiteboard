var express = require('express'),
	app = express(),
	http = require('http'),
	socketio = require('socket.io');

var server = http.createServer(app);
var io = socketio.listen(server);

server.listen(8080);
app.use(express.static(__dirname + '/static'));
console.log("Server running on localhost:8080");

var line_history = [];
var color_history = [];
var size_history = [];
var lastline;
var lastcol;
var lastsize;

io.on('connection', function (socket) {
	for (var i in line_history) {
		socket.emit('draw_line', { line: line_history[i], color: color_history[i], size: size_history[i]} );
	}

  	socket.on('typing', function(b){
  	  io.emit('typing', b);
 	 });

 	 socket.on('chat message', function(msg, n){
  	  io.emit('chat message', msg, n);
  	});

	socket.on('length', function () {
		io.emit('length', {leng: line_history.length});
	});

	socket.on('draw_line', function (data) {
		line_history.push(data.line);
		color_history.push(data.color);
		size_history.push(data.size);
		io.emit('draw_line', { line: data.line, color: data.color, size: data.size});
	});

	socket.on('undo', function (data) {
		lastline = line_history.splice(0-data.leng, data.leng);
		lastcol = color_history.splice(0-data.leng, data.leng);
		lastsize = size_history.splice(0-data.leng, data.leng);
		io.emit('reload');
	});

	socket.on('redo', function () {
		for (var i in lastline) {
			io.emit('draw_line', { line: lastline[i], color: lastcol[i], size: lastsize[i]} );
		}
	});

	socket.on('clear', function() {
		line_history.length = 0;
		color_history.length = 0;
		size_history.length = 0;
		io.emit('clear');
	});
});
