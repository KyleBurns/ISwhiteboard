var express = require('express'),
	app = express(),
	http = require('http'),
	socketio = require('socket.io'),
	fs = require('fs');

var server = http.createServer(app);
var io = socketio.listen(server);

server.listen(3000, "0.0.0.0");
app.use(express.static(__dirname + '/static'));
console.log("Server running on localhost:3000");
var boards = [];
var rawText = "";

fs.readFile(__dirname + '/whiteboards.txt', 'utf8', (err, data) => {
	if (err) 
		throw err;
	rawText = data;
	console.log(rawText);
	boards = JSON.parse(rawText);
});



//var commandHistory = [];
//var commandNumber = 0;
//var id;
var clients = [];

function decLastCommand(sid){
	for(var i = 0; i < boards.length; i++){
			if(boards[i].id == sid){
				if(boards[i].commandNumber <= 0)
					boards[i].commandNumber = 0;
				else
					boards[i].commandNumber--; 
			}

		}
/* 	if(commandNumber <= 0)
		commandNumber = 0;
	else
		commandNumber--; */
}

function incLastCommand(sid){
	for(var i = 0; i < boards.length; i++){
			if(boards[i].id == sid){
				if(boards[i].commandNumber >= boards[i].commandHistory.length)
					boards[i].commandNumber = boards[i].commandHistory.length;
				else
					boards[i].commandNumber++; 
			}

		}

	/* if(commandNumber >= commandHistory.length)
		commandNumber = commandHistory.length;
	else
		commandNumber++; */
}

function getClientsWithId(sid){
	var clientsWithID = [];
	for(var i = 0; i < clients.length; i++){
		if(clients[i].boardId == sid)
			clientsWithID.push(clients[i].socket);
	}
	return clientsWithID;
}


io.on('connection', function (socket) {
	
	socket.on("register",function(id){
		clients.push({socket: socket, boardId: id});
 	});
	
	socket.on("disconnect",function(){
		for(var i = 0; i < clients.length; i++){
			if(clients[i].socket == socket)
				clients.splice(i, 1);
		}
 	});
	 
	socket.on('create', function(sid){
		var found = false;
		for(var i = 0; i < boards.length && found == false; i++){
			if(boards[i].id == sid)
				found = true;
		}
		if(!found){

			boards.push({id: sid, commandHistory: [], commandNumber: 0});
		}
		for(var i = 0; i < boards.length; i++){
			if(boards[i].id == sid){
				for (var x = 0; x < boards[i].commandNumber ; x++) {
					var command = boards[i].commandHistory[x];
					if(command.type == "line"){
						var line = command.data;
						var sockets = getClientsWithId(sid);
						for(var y = 0; y < line.points.length - 2; y++){
							for(var z = 0; z < sockets.length; z++){
								sockets[z].emit('draw_line', line.points[y], line.points[y + 1], line.colour, line.width);
							}
						}
					}else if(command.type == "clear"){
						for(var z = 0; z < sockets.length; z++){
								sockets[z].emit('clear');
						}
			
					}
				} 
				
			}

		}
		

		
		/* for (var x = 0; x < commandNumber ; x++) {
			var command = commandHistory[x];
			if(command.type == "line"){
				var line = command.data;
				for(var i = 0; i < line.points.length - 2; i++){
					io.emit('draw_line', line.points[i], line.points[i + 1], line.colour, line.width);
				}
			}else if(command.type == "clear"){
				io.emit('clear');
			}
		} */
 	 });

	//Chat
  	socket.on('typing', function(b, sid){
		for(var i = 0; i < clients.length; i++){
			if(clients[i].boardId == sid)
				clients[i].socket.emit('typing', b);
		}
 	 });

 	 socket.on('chat message', function(msg, n, sid){
		for(var i = 0; i < clients.length; i++){
			if(clients[i].boardId == sid)
				clients[i].socket.emit('chat message', msg, n);
		}
  	});

	//Canvas
	socket.on('draw_line', function (pointA, pointB, colour, width, sid) {
		var sockets = getClientsWithId(sid);
		for(var z = 0; z < sockets.length; z++){
			sockets[z].emit('draw_line', pointA, pointB, colour, width);
		}
				
		//io.emit('draw_line', pointA, pointB, colour, width);
	});
	
	socket.on('save_line', function (line, sid) {
		for(var i = 0; i < boards.length; i++){
			if(boards[i].id == sid){
				if(boards[i].commandHistory.length != boards[i].commandNumber)
					boards[i].commandHistory = boards[i].commandHistory.slice(0,boards[i].commandNumber);
				boards[i].commandHistory.push({type: "line", data: line});
				incLastCommand(sid); 
			}
		}
		
		
		/* if(commandHistory.length != commandNumber)
			commandHistory = commandHistory.slice(0,commandNumber);
		commandHistory.push({type: "line", data: line});
		incLastCommand(sid); */
	});

	socket.on('undo', function (sid) {
		for(var i = 0; i < boards.length; i++){
			if(boards[i].id == sid){
				decLastCommand(sid)
				var sockets = getClientsWithId(sid);
				for(var z = 0; z < sockets.length; z++){
					sockets[z].emit('reload');
				}
			}
		}
		
		//decLastCommand(sid);
		//io.emit('reload');
	});

	socket.on('redo', function (sid) {
		for(var i = 0; i < boards.length; i++){
			if(boards[i].id == sid){
				incLastCommand(sid)
				var sockets = getClientsWithId(sid);
				for(var z = 0; z < sockets.length; z++){
					sockets[z].emit('reload');
				}
			}
		}
		
		//incLastCommand(sid);
		//io.emit('reload');
	});

	socket.on('clear', function(sid) {
		for(var i = 0; i < boards.length; i++){
			if(boards[i].id == sid){
				if(boards[i].commandHistory.length != boards[i].commandNumber)
					boards[i].commandHistory = boards[i].commandHistory.slice(0,boards[i].commandNumber);
				boards[i].commandHistory.push({type: "clear"});
				incLastCommand(sid);
				var sockets = getClientsWithId(sid);
				for(var z = 0; z < sockets.length; z++){
					sockets[z].emit('clear');
				}
			}
		}
		
		
		
		
		/* if(commandHistory.length != commandNumber)
			commandHistory = commandHistory.slice(0,commandNumber);
		commandHistory.push({type: "clear"});
		incLastCommand(sid);
		io.emit('clear');
		console.log(commandNumber);
		console.log(commandHistory); */
	});
});

process.stdin.resume();

function exitHandler(options, err) {
	
    if (options.cleanup) console.log('clean');
    if (err) {console.log(err.stack);console.log("err");}
	if (options.exit) {
		console.log("exit");
		fs.writeFileSync('whiteboards.txt', JSON.stringify(boards), 'utf8');
		process.exit();
	}
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

