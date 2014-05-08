var canvas;
var ctx;

var WIDTH = 512;
var HEIGHT = 480;

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
	ctx.beginPath();
	ctx.arc(me.bodyX,me.bodyY - 21,4,0,2*Math.PI);
	ctx.fillStyle="#FFFF66"
	ctx.fill();
	ctx.lineWidth=2;
	ctx.strokeStyle="#FFFF66"	
	ctx.stroke();
	ctx.closePath();
}

function drawBody(){
	ctx.beginPath();
	ctx.arc(me.bodyX,me.bodyY,25,0,2*Math.PI);
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
		mouseX = event.pageX;
		mouseY = event.pageY;
	  var msg = 'mousemove() position - x : ' + event.pageX + ', y : '
	                + event.pageY;
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
	if (38 in keysDown) { // Player holding up
		me.bodyY -= me.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		me.bodyY += me.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		me.bodyX -= me.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		me.bodyX += me.speed * modifier;
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