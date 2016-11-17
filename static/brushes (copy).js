$(function() {
    //$("#templates").children("svg").wrap("<span>");
    var canvas = document.getElementById('whiteboard');
    var ctx = canvas.getContext('2d');
	    var canvasOffset = $("#whiteboard").offset();
            var offsetX = canvasOffset.left;
            var offsetY = canvasOffset.top;
            var canvasWidth = canvas.width;
            var canvasHeight = canvas.height;
            var isDragging = false;

    $("#circ")
        .on("click", function() {
            var clone = '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><circle r="25" cx="25" cy="25"/></svg>';
            var img = new Image();
            var svg = new Blob([clone], {
                type: 'image/svg+xml'
            });
            var DOMURL = window.URL || window.webkitURL || window;
            var url = DOMURL.createObjectURL(svg);

            img.onload = function() {
                ctx.drawImage(img, 0, 0);
                DOMURL.revokeObjectURL(url);
            }

            img.src = url;

            function handleMouseDown(e) {
                canMouseX = parseInt(e.clientX - offsetX);
                canMouseY = parseInt(e.clientY - offsetY);
                // set the drag flag
                isDragging = true;
            }

            function handleMouseUp(e) {
                canMouseX = parseInt(e.clientX - offsetX);
                canMouseY = parseInt(e.clientY - offsetY);
                // clear the drag flag
                isDragging = false;
            }

            function handleMouseOut(e) {
                canMouseX = parseInt(e.clientX - offsetX);
                canMouseY = parseInt(e.clientY - offsetY);
                // user has left the canvas, so clear the drag flag
                //isDragging=false;
            }

            function handleMouseMove(e) {
                canMouseX = parseInt(e.clientX - offsetX);
                canMouseY = parseInt(e.clientY - offsetY);
                // if the drag flag is set, clear the canvas and draw the image
                if (isDragging) {
                    ctx.drawImage(img, canMouseX - 64 / 2, canMouseY - 60 / 2, 64, 60);
                }
            }

            $("#whiteboard").mousedown(function(e) {
                handleMouseDown(e);
            });
            $("#whiteboard").mousemove(function(e) {
                handleMouseMove(e);
            });
            $("#whiteboard").mouseup(function(e) {
                handleMouseUp(e);
            });
            $("#whiteboard").mouseout(function(e) {
                handleMouseOut(e);
            });
        });
   $("#star")
        .on("click", function() {
            var cl = '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><polygon points="35,7 38,16 46,17 39,21 42,30 35,25 27,30 30,21 23,16 32,16" /></svg>';
            var img2 = new Image();
            var svg2 = new Blob([cl], {
                type: 'image/svg+xml'
            });
	    var DOMURL = window.URL || window.webkitURL || window;
	    var url2 = DOMURL.createObjectURL(svg2);

            img2.onload = function() {
                ctx.drawImage(img2, 0, 0);
                DOMURL.revokeObjectURL(url2);
            }

            img2.src = url2;

            function handleMouseDown(e) {
                canMouseX = parseInt(e.clientX - offsetX);
                canMouseY = parseInt(e.clientY - offsetY);
                // set the drag flag
                isDragging = true;
            }

            function handleMouseUp(e) {
                canMouseX = parseInt(e.clientX - offsetX);
                canMouseY = parseInt(e.clientY - offsetY);
                // clear the drag flag
                isDragging = false;
            }

            function handleMouseOut(e) {
                canMouseX = parseInt(e.clientX - offsetX);
                canMouseY = parseInt(e.clientY - offsetY);
                // user has left the canvas, so clear the drag flag
                //isDragging=false;
            }

            function handleMouseMove(e) {
                canMouseX = parseInt(e.clientX - offsetX);
                canMouseY = parseInt(e.clientY - offsetY);
                // if the drag flag is set, clear the canvas and draw the image
                if (isDragging) {
                    ctx.drawImage(img2, canMouseX - 64 / 2, canMouseY - 60 / 2, 64, 60);
                }
            }

            $("#whiteboard").mousedown(function(e) {
                handleMouseDown(e);
            });
            $("#whiteboard").mousemove(function(e) {
                handleMouseMove(e);
            });
            $("#whiteboard").mouseup(function(e) {
                handleMouseUp(e);
            });
            $("#whiteboard").mouseout(function(e) {
                handleMouseOut(e);
            });
            
        });
   $("#squa").on("click", function() {
            var clo = '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><rect x="0" y="0" width="50" height="50"/></svg>';

            var img3 = new Image();
            var svg3 = new Blob([clo], {
                type: 'image/svg+xml'
            });
            var DOMURL = window.URL || window.webkitURL || window;
	    var url3 = DOMURL.createObjectURL(svg3);

            img3.onload = function() {
                ctx.drawImage(img3, 0, 0);
                DOMURL.revokeObjectURL(url3);
            }

            img3.src = url3;


            function handleMouseDown(e) {
                canMouseX = parseInt(e.clientX - offsetX);
                canMouseY = parseInt(e.clientY - offsetY);
                // set the drag flag
                isDragging = true;
            }

            function handleMouseUp(e) {
                canMouseX = parseInt(e.clientX - offsetX);
                canMouseY = parseInt(e.clientY - offsetY);
                // clear the drag flag
                isDragging = false;
            }

            function handleMouseOut(e) {
                canMouseX = parseInt(e.clientX - offsetX);
                canMouseY = parseInt(e.clientY - offsetY);
                // user has left the canvas, so clear the drag flag
                //isDragging=false;
            }

            function handleMouseMove(e) {
                canMouseX = parseInt(e.clientX - offsetX);
                canMouseY = parseInt(e.clientY - offsetY);
                // if the drag flag is set, clear the canvas and draw the image
                if (isDragging) {
                    ctx.drawImage(img3, canMouseX - 64 / 2, canMouseY - 60 / 2, 64, 60);
                }
            }

            $("#whiteboard").mousedown(function(e) {
                handleMouseDown(e);
            });
            $("#whiteboard").mousemove(function(e) {
                handleMouseMove(e);
            });
            $("#whiteboard").mouseup(function(e) {
                handleMouseUp(e);
            });
            $("#whiteboard").mouseout(function(e) {
                handleMouseOut(e);
            });
            
        });
	    
});
