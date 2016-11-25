var length = 0;
var chatlen = 0;
var chatcolor;
var undo = 0;
var sc = "black";
var ss = "1";
var socket  = io.connect();
var id = getParameterByName("id");

function changeC(c) {
    sc = c;
    tri = "Selected: " + sc + ", " + ss + " pixels";
    document.getElementById('select').innerHTML=tri;
}

function changeS(s) {
    ss = s;
    tri = "Selected: " + sc + ", " + ss + " pixels";
    document.getElementById('select').innerHTML=tri;
}

document.addEventListener("DOMContentLoaded", function() {

	//c = getRandomColor();
	var mouse = { 
		click: false,
		move: false,
		pos: {x:0, y:0},
		pos_prev: false
	}; 
	var line = {
		points : [],
		colour: "black",
		width: 1
	};
	var canvas  = document.getElementById('whiteboard');
	var context = canvas.getContext('2d');
	var rect = canvas.getBoundingClientRect();
	var width   = 1200;
	var height  = 800;

	canvas.width = width;
	canvas.height = height;
	context.fillStyle = "white";
	context.fillRect(0, 0, canvas.width, canvas.height);
	socket.emit("register", id);
	socket.emit("create", id);
	
	
	canvas.onmousedown = function(e){ 
		console.log("Mouse down");
		mouse.click = true; 
		line.points = [];
		var colors = document.getElementsByName('color');
		var sizes = document.getElementsByName('size');
		line.colour = sc;
		line.width = ss;
	};
 	canvas.onmouseup = function(e){ 
		console.log("Mouse up");
		mouse.click = false; 
		socket.emit("save_line", line, id);
		

	};
	canvas.onmousemove = function(e) {
		
		if(mouse.click && mouse.x != e.x && mouse.y != e.y){
			mouse.x = e.x;
			mouse.y = e.y;
			mouse.move = true;
			console.log("Mouse move");
			line.points.push({x: e.x, y: (e.y - rect.top)});
			for(var i = 0; i < line.points.length; i++){
				console.log(line.points[i].x + " " + line.points[i].y + " " +  line.points.length);
			}

			if(line.points.length > 1)
				drawLine(line.points[line.points.length - 2], line.points[line.points.length - 1]);
		}else
			mouse.move = false;
	};
	
	function drawLine(pointA, pointB) {
		context.beginPath();
		context.strokeStyle = line.colour;
		context.moveTo(pointA.x, pointA.y);
		context.lineTo(pointB.x, pointB.y);
		context.lineWidth = line.width;
		context.stroke();
		socket.emit('draw_line', pointA, pointB, line.colour, line.width, id);
	}
	
	function getParameterByName(name, url) {
		if (!url) {
			url = window.location.href;
		}
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}	
	
	socket.on('draw_line', function (pointA, pointB, colour, width) {
		console.log("actural drawline");
		console.log(socket.id);
		context.beginPath();
		context.strokeStyle = colour;
		context.moveTo(pointA.x, pointA.y);
		context.lineTo(pointB.x, pointB.y);
		context.lineWidth = width;
		context.stroke();
	});
	
	socket.on('clear', function() {
		console.log("clear");
		context.fillRect(0, 0, canvas.width, canvas.height);
	});
	
	
	
	
	socket.on('reload', function() { 
		context.fillRect(0, 0, canvas.width, canvas.height);
		socket.emit('create', id);
	});
});

function clearCanvas() {
	var r = confirm("Are you sure you want to clear the canvas?");
	if (r == true) {
		socket.emit('chat message', "has cleared the whiteboard.",nick, id);
		socket.emit('clear', id);
	}	
   }
   

function undo1() {
	socket.emit('undo', id);
   }
function redo1() {
	socket.emit('redo', id);
   }

function save1() {
   var a = document.createElement('a');
   var canvas  = document.getElementById('whiteboard');
   a.href = canvas.toDataURL();
   a.download = "output.png";
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
}

// ------------------ CHAT ------------------------

var nick = getParameterByName('name');
var e = document.getElementById("namess").setAttribute("value", nick);
//console.log(socket.id + " chat");
socket.emit('chat message', "has joined the server.",nick , id);

function getParameterByName(name, url) {
	if (!url) {
		url = window.location.href;
	}
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}	
    
$('#typing').hide();

$('#chat').submit(function(){
	
    if($('#m').val() != ''){
		socket.emit('chat message', $('#m').val(), nick, id);
		$('#m').val('');
	}

    return false;
});

//Whenever a key is lifted while a user is typing into the message box, emit a 'typing' message to the server.
//True if the current form contains characters, and false if empty.
$("#m").keyup(function(){
    if ($('#m').val() != ''){	
		console.log("typing");
		socket.emit('typing', true, id);
    }
    else{
        socket.emit('typing', false, id);	
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
    //$('#messages').first().color = c;
    chatlen = chatlen + 1;
    var top = $("#chatDiv").css("top");
    top = top.slice(0,-2);
    top = top - 19;
    top = top + "px";
    $("#chatDiv").css({"top": top});
    $('#typing').hide();
    if(chatlen > 5) {
	}
    });
