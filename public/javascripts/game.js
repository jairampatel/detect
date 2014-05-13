var canvas;
var ctx;
var started;

var WIDTH = 512;
var HEIGHT = 512;
var BODY_RADIUS = 25;
var SPEED_MODIFIER = 0.02;

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var PROJECTILE_LENGTH = 4096;

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
	addProjectile(x,y,me.frontX,me.frontY);
}
function touchingWall(direction){
	switch(direction){
		case UP:
			if(me.bodyY - (me.speed * SPEED_MODIFIER) - BODY_RADIUS >= 0)
				return false;
			break;
		case DOWN:
			if(me.bodyY + (me.speed * SPEED_MODIFIER) + BODY_RADIUS < HEIGHT)
				return false;
			break;
		case LEFT:
			if(me.bodyX - (me.speed * SPEED_MODIFIER) - BODY_RADIUS >= 0)
				return false;
			break;
		case RIGHT:
			if(me.bodyX + (me.speed * SPEED_MODIFIER) + BODY_RADIUS < WIDTH){
				return false;
			}
			break;
	}
	return true;
}
// limits value to the range min..max
function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val))
}
 

function bodyIntersectsBarrier(barrier,direction){
	var centerX = barrier.x + (barrier.width / 2);
	var centerY = barrier.y + (barrier.height / 2);
	
	// Find the closest point to the circle within the rectangle
	// Assumes axis alignment! ie rect must not be rotated
	var closestX;
	var closestY;
	
	var deltaX = 0;
	var deltaY = 0;

	switch(direction){
		case UP:
			deltaY = -1 * (me.speed * SPEED_MODIFIER);
		break;
		case DOWN:
			deltaY = (me.speed * SPEED_MODIFIER);
		break;
		case LEFT:
			deltaX = -1 * (me.speed * SPEED_MODIFIER);
		break;
		case RIGHT:
			deltaX = (me.speed * SPEED_MODIFIER);
		break;
	}
	closestX = clamp(me.bodyX + deltaX, barrier.x, barrier.x + barrier.width);
	closestY = clamp(me.bodyY + deltaY, barrier.y, barrier.y + barrier.height);

	// Calculate the distance between the circle's center and this closest point
	var distanceX = me.bodyX + deltaX - closestX;
	var distanceY = me.bodyY + deltaY - closestY;
	 
	// If the distance is less than the circle's radius, an intersection occurs
	var distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

	return distanceSquared < (BODY_RADIUS * BODY_RADIUS);
}
function touchingBarriers(direction){
	var index;
	for(index = 0;index < barriers.length;index++){
		if(bodyIntersectsBarrier(barriers[index],direction)){
			return true;
		}
	}
	return false;
}
function canMove(direction){
	if(!touchingWall(direction) && !touchingBarriers(direction)){
		return true;
	}
	return false;
}
function updateFront(){
	var deltaX = mouseX - me.bodyX;
	var deltaY = mouseY - me.bodyY;
	var angle = Math.atan2(deltaY,deltaX);

	var x = (BODY_RADIUS-2) * Math.cos(angle);
	var y = (BODY_RADIUS-2) * Math.sin(angle);

	me.frontX = me.bodyX + x; 
	me.frontY = me.bodyY + y;
}
function updateBody(){
	var delta = me.speed * SPEED_MODIFIER;
	if ((87 in keysDown || 38 in keysDown)) { // up
		if(canMove(UP))
			me.bodyY -= delta;
	}
	if ((83 in keysDown || 40 in keysDown)) { // down
		if(canMove(DOWN))
			me.bodyY += delta;
	}
	if ((65 in keysDown || 37 in keysDown)) { // left
		if(canMove(LEFT))
			me.bodyX -= delta;
	}
	if ((68 in keysDown || 39 in keysDown)) { // right
		if(canMove(RIGHT))
			me.bodyX += delta;
	}
}

function updatePlayer(){
	updateBody();
	updateFront();
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

	$('#myCanvas').mousedown(function(event) {
		fire(mouseX,mouseY);	  	
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

	update(SPEED_MODIFIER);
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