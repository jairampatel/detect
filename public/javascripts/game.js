var canvas;
var ctx;
var started;

var WIDTH = 512;
var HEIGHT = 480;
var BODY_RADIUS = 25;
var SPEED_MODIFER = 0.02;

var keysDown;
var mouseX;
var mouseY;

var me;

var barriers;
var then = Date.now();



function drawBarriers(){
	var index;
	for(index = 0;index < barriers.length;index++){
		// TODO1 draw barriers
	}	
}

function fire(){
	// TODO1 add to projectile array
}

function updatePlayer(){
	var delta = me.speed * SPEED_MODIFER;
	if ((87 in keysDown || 38 in keysDown) && me.bodyY - delta - BODY_RADIUS >= 0) { // up
		me.bodyY -= delta;
	}
	if ((83 in keysDown || 40 in keysDown) && me.bodyY + delta + BODY_RADIUS < HEIGHT) { // down
		me.bodyY += delta;
	}
	if ((65 in keysDown || 37 in keysDown) && me.bodyX - delta - BODY_RADIUS >= 0) { // left
		me.bodyX -= delta;
	}
	if ((68 in keysDown || 39 in keysDown) && me.bodyX + delta + BODY_RADIUS < WIDTH) { // right
		me.bodyX += delta;
	}
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

function setMePosition(x,y){
	me.bodyX = x;
	me.bodyY = y;
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

function addBarriers(){
	// TODO1 add barriers
}

function render(){
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	drawBody();
	drawBarriers();
	drawProjectiles(); // projectile.js
}

function update() {
	updatePlayer();
	updateProjectiles(); // projectile.js
};

// The main game loop
function main() {	

	var now = Date.now();
	var delta = now - then;

	update(.02);
	render();

	then = now;

	requestAnimationFrame(main);
};

function initVariables(){
	projectiles = [];
	barriers = [];
	keysDown = {};
	mouseX = -1;
	mouseY = -1;

	me = {
		speed: 128, // movement in pixels per second
		bodyX: -1,
		bodyY: -1,
		frontX: -1,
		frontY: -1
	};
	addBarriers();
}
function setUp(){
	initVariables();
	createCanvas();
	addListeners();

	setMePosition(canvas.width/2, canvas.height/2);
	drawBody();
	drawBarriers();

	started = true;
}

function startGame(){
	if(!started){
		setUp();
		main();
	}
}

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;