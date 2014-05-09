var canvas;
var ctx;

var WIDTH = 512;
var HEIGHT = 480;
var BODY_RADIUS = 25;

var keysDown = {};
var mouseX = -1;
var mouseY = -1;

var then = Date.now();

var me = {
	speed: 256, // movement in pixels per second
	bodyX: -1,
	bodyY: -1,
	frontX: -1,
	frontY: -1
};

function createCanvas(){
	canvas = document.createElement("canvas");
	canvas.setAttribute("id","myCanvas")
	ctx = canvas.getContext("2d");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.background = "#ffffff"
	canvas.style.border="1px solid #000000";
	document.getElementById("game").appendChild(canvas);
}

function setMePosition(x,y){
	me.bodyX = x;
	me.bodyY = y;
}

function drawFront(){

	var deltaX = mouseX - me.bodyX;
	var deltaY = mouseY - me.bodyY;
	var angle = Math.atan2(deltaY,deltaX);

	//console.log('angle is: ' + angle + ' radians');
	var x = (BODY_RADIUS-2) * Math.cos(angle);
	var y = (BODY_RADIUS-2) * Math.sin(angle);

	ctx.beginPath();
	ctx.arc(me.bodyX + x,me.bodyY + y,4,0,2*Math.PI);
	ctx.fillStyle="#FFFF66"
	ctx.fill();
	ctx.lineWidth=2;
	ctx.strokeStyle="#FFFF66"	
	ctx.stroke();
	ctx.closePath();
}

function drawBody(){
	ctx.beginPath();
	ctx.arc(me.bodyX,me.bodyY,BODY_RADIUS,0,2*Math.PI);
	ctx.fillStyle="#00331F";
	ctx.fill();
	ctx.lineWidth=2;
	ctx.strokeStyle="#003300"
	
	ctx.stroke();
	ctx.closePath();

	drawFront();
}

function render(){

	drawBody();
}
function mainLoop(){

	render();
}

function addListeners(){
	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);

	$('#myCanvas').mousemove(function(event) {
		
	  	

	  	var parentOffset = $(this).parent().offset(); 
	   	//or $(this).offset(); if you really just want the current element's offset
	   	var relX = event.pageX - parentOffset.left;
	   	var relY = event.pageY - parentOffset.top;

	   	mouseX = relX;
		mouseY = relY;


	  	var msg = 'mousemove() position - x : ' + relX + ', y : '
	                + relY;
	    
	  	//console.log(msg);
	});
}
function setUp(){
	createCanvas();
	addListeners();

	setMePosition(canvas.width/2, canvas.height/2);
	drawBody();
}

// Update game objects
var update = function (modifier) {

	var delta = me.speed * modifier;
	if ((87 in keysDown || 38 in keysDown) && me.bodyY - delta - BODY_RADIUS >= 0) { // Player holding up
		me.bodyY -= delta;
	}
	if ((83 in keysDown || 40 in keysDown) && me.bodyY + delta + BODY_RADIUS < HEIGHT) { // Player holding down
		me.bodyY += delta;
	}
	if ((65 in keysDown || 37 in keysDown) && me.bodyX - delta - BODY_RADIUS >= 0) { // Player holding left
		me.bodyX -= delta;
	}
	if ((68 in keysDown || 39 in keysDown) && me.bodyX + delta + BODY_RADIUS < WIDTH) { // Player holding right
		me.bodyX += delta;
	}
};

// Draw everything
var render = function () {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	drawBody();
};

// The main game loop
var main = function () {	

	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

function startGame(){
	setUp();
	main();
	
}

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;