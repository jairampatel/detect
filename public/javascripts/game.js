var canvas;
var ctx;
var started;

var WIDTH = 512;
var HEIGHT = 512;
var BODY_RADIUS = 25;
var SPEED_MODIFER = 0.02;

var keysDown;
var mouseX;
var mouseY;

var me;

var barriers;

function drawBarriers(){
	var index;
	for(index = 0;index < barriers.length;index++){
		ctx.fillStyle="#000000";
		ctx.fillRect(barriers[index].x,barriers[index].y,barriers[index].width,barriers[index].height);
	}	
}

function fire(x,y){
	// TODO1 add {direction/slope} to projectile array based on mousePositionX/Y and faceX/Y
}
function touchingWall(){
	if((me.bodyY - delta - BODY_RADIUS >= 0) &&
		(me.bodyY + delta + BODY_RADIUS < HEIGHT) &&
		 (me.bodyX - delta - BODY_RADIUS >= 0) &&
		  (me.bodyX + delta + BODY_RADIUS < WIDTH))){
		return false;
	}
	return true;
}
function bodyIntersectsBarrier(barrier){
	
}
function touchingBarriers(){
	var index;
	for(index = 0;index < barriers.length;index++){
		if(bodyIntersectsBarrier(barriers[index])){
			return true;
		}
	}
	return false;
}
function canMove(){
	if(!touchingWall() && !touchingBarriers()){
		return true;
	}
	return false;
}
function updateFace(){
	var deltaX = mouseX - me.bodyX;
	var deltaY = mouseY - me.bodyY;
	var angle = Math.atan2(deltaY,deltaX);

	//console.log('angle is: ' + angle + ' radians');
	var x = (BODY_RADIUS-2) * Math.cos(angle);
	var y = (BODY_RADIUS-2) * Math.sin(angle);

	me.frontX = me.bodyX + x; 
	me.frontY = me.bodyY + y;
}
function updateBody(){
	var delta = me.speed * SPEED_MODIFER;
	if ((87 in keysDown || 38 in keysDown)) { // up
		me.bodyY -= delta;
	}
	if ((83 in keysDown || 40 in keysDown)) { // down
		me.bodyY += delta;
	}
	if ((65 in keysDown || 37 in keysDown)) { // left
		me.bodyX -= delta;
	}
	if ((68 in keysDown || 39 in keysDown)) { // right
		me.bodyX += delta;
	}
}
function updatePlayer(){
	if(canMove()){
		updateBody();
		updateFace();
	}
}

function drawFront(){
	ctx.beginPath();
	ctx.arc(me.frontX,me.frontY,4,0,2*Math.PI);
	ctx.fillStyle="#FFFF66"
	ctx.fill();
	ctx.lineWidth=2;
	ctx.strokeStyle="#FFFF66"	
	ctx.stroke();
	ctx.closePath();
}

function drawPlayer(){
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

  		var msg = 'mousemove() position - x : ' + relX + ', y : ' + relY;
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
	barriers.push({
		x:WIDTH / 6,
		y:HEIGHT / 6,
		width:100,
		height:10
	});
	barriers.push({
		x:WIDTH * 4 / 6,
		y:HEIGHT * 2 / 6,
		width:100,
		height:10
	});
	barriers.push({
		x:WIDTH * 4 / 6,
		y:HEIGHT * 4 / 6,
		width:100,
		height:10
	});
	barriers.push({
		x:WIDTH / 6,
		y:HEIGHT * 5 / 6,
		width:100,
		height:10
	});
}

function render(){
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	drawPlayer();
	drawBarriers();
	drawProjectiles(); // projectile.js
}

function update() {
	updatePlayer();
	updateProjectiles(); // projectile.js
};

// The main game loop
function main() {	

	update(SPEED_MODIFER);
	render();

	requestAnimationFrame(main);
};

function initVariables(){
	projectiles = [];
	barriers = [];
	keysDown = {};
	mouseX = canvas.width/2;
	mouseY = canvas.height/2 - 20;

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
	createCanvas();
	initVariables();
	addListeners();

	setMePosition(canvas.width/2, canvas.height/2);
	drawPlayer();
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