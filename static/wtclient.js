var length = 0;
var undo = 0;
document.addEventListener("DOMContentLoaded", function() {
   var mouse = { 
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   }; 
   var canvas  = document.getElementById('whiteboard');
   var context = canvas.getContext('2d');
   var width   = 1200;
   var height  = 800;
   var socket  = io.connect();
   canvas.width = width;
   canvas.height = height;
   canvas.onmousedown = function(e){ mouse.click = true; };
   canvas.onmouseup = function(e){ mouse.click = false; socket.emit('length');};
   canvas.onmousemove = function(e) {
      mouse.pos.x = e.clientX / width;
      mouse.pos.y = (e.clientY+120) / height;
      mouse.move = true;
   };

   socket.on('draw_line', function (data) {
      var line = data.line;
      context.beginPath();
      context.strokeStyle = data.color;
      context.moveTo(line[0].x * width, (line[0].y * height)-180);
      context.lineTo(line[1].x * width, (line[1].y * height)-180);
      context.lineWidth = data.size;
      context.stroke();
   });

   socket.on('clear', function() {
	context.clearRect(0, 0, canvas.width, canvas.height);
   });
   
   socket.on('length', function(data) {console.log(data.leng); length = data.leng;});

   socket.on('reload', function() { location.reload();});

   function mainLoop() {      
      if (mouse.click && mouse.move && mouse.pos_prev) {
         undo = length;
	 var colors = document.getElementsByName('color');
	 var sizes = document.getElementsByName('size');

	 for(var i = 0; i < colors.length; i++) {
	 	if(colors[i].checked == true) {
       			var selectedColor = colors[i].value;
   			}
 		}

	 for(var i = 0; i < sizes.length; i++) {
	 	if(sizes[i].checked == true) {
       			var selectedSize = sizes[i].value;
   			}
 		}

         socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev], color: selectedColor, size: selectedSize });
         mouse.move = false;
      }
      mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
      setTimeout(mainLoop, 25);
   }
   mainLoop();
});

function clear1() {
	var socket  = io.connect();
 	var r = confirm("Are you sure you want to clear the canvas?");
	if (r == true) {
        socket.emit('chat message', "has cleared the whiteboard.",nick);
	socket.emit('clear');}
   }
function undo1() {
	var socket  = io.connect();
	socket.emit('undo', { leng: length-undo });
   }
function redo1() {
	var socket  = io.connect();;
	socket.emit('redo');
   }
