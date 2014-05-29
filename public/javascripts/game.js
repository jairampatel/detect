var canvas;
var ctx;
var started;

var opponentReady;
var waitingForMe;
var countdownComplete;

var countdown;
var countdownCount;

var WIDTH = 512;
var HEIGHT = 512;
var BODY_RADIUS = 25;
var FRONT_RADIUS = 4;
var SPEED_MODIFIER = 0.02;

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var END = 2 * Math.PI;

var OFFSET_LEFT = -1;
var OFFSET_TOP = -1;


var keysDown;
var mouseX;
var mouseY;

var changed = 0;
var me;
var opponent;


var barriers;
var body = ["#00331F","#0066FF"];
var bodyStroke = ["#003300","#0000FF"];

var front = ["#FFFF66","#FFFF66"];
var frontStroke = ["#FFFF66","#FFFF66"];
var ME = 0;
var OPPONENT = 1;

var connected = 0;

function playersReady(){
	var result = (started && opponentReady);
	console.log('started: ' + started);
	console.log('opponentReady: ' + opponentReady);
	console.log('players ready: ' + result);
	return result;
}
function startCountdown(){

	console.log('starting countdown');
	countdown = setInterval(updateCountdown,1000);
}
function updateCountdown(){
	console.log('count: ' + countdownCount);
	if(countdownCount > 0){
		//ctx.fillStyle="#FFFFFF";
		//ctx.fillRect(WIDTH / 2,HEIGHT / 2,20,20);
		ctx.fillStyle="#000000";
		ctx.font="20px Georgia";
		ctx.fillText("HELLO WORLD",WIDTH / 2, HEIGHT / 2);
		countdownCount--;
	}
	else{
		stopCountdown();
	}
}
function stopCountdown(){
	clearInterval(countdown);
	countdownComplete = true;
	addListeners();
}
function canStart(){
	return (started && opponentReady && countdownComplete);
}
function getBodyX(){
	if(canStart())
		return me.bodyX;
	return 0;
}

function getBodyY(){
	if(canStart())
		return me.bodyY;
	return 0;
}

function getFrontX(){
	if(canStart())
		return me.frontX;
	return 0;
}

function getFrontY(){
	if(canStart())
		return me.frontY;
	return 0;
}

function setName(id,nickname){
	$(id).html(nickname);
}
function setOpponentReady(){
	if(!started){
		waitingForMe = true;
	}
	else{
		opponentReady = true;
	}
	if(playersReady()){
		startCountdown();
	}
}

function setOpponent(bodyX, bodyY, frontX, frontY){
	opponent.bodyX = bodyX;
	opponent.bodyY = bodyY;
	opponent.frontX = frontX;
	opponent.frontY = frontY;
}
function drawOpponent(){
	if(canStart()){
		drawCircle(opponent.bodyX,opponent.bodyY,BODY_RADIUS,0,END,body[OPPONENT],bodyStroke[OPPONENT]);
		drawCircle(opponent.frontX,opponent.frontY,FRONT_RADIUS,0,END,front[OPPONENT],frontStroke[OPPONENT]);
	}
}

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
    return Math.max(min, Math.min(max, val));
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
function reflectPoint(x,y){
	var halfWidth = WIDTH / 2;
	var halfHeight = HEIGHT / 2;

	var difX = x - halfWidth;
	var difY = y - halfHeight;

	return {
		x: halfWidth - difX,
		y: halfHeight - difY
	};

}
function getFront(bodyX,bodyY,mX,mY){
	var deltaX = mX - bodyX;
	var deltaY = mY - bodyY;
	var angle = Math.atan2(deltaY,deltaX);

	var x = (BODY_RADIUS-2) * Math.cos(angle);
	var y = (BODY_RADIUS-2) * Math.sin(angle);

	return {
		x: bodyX + x,
		y: bodyY + y
	}
}
function updateFront(){
	var result = getFront(me.bodyX,me.bodyY,mouseX,mouseY);

	me.frontX = result.x; 
	me.frontY = result.y;
}
function updateBody(){
	var delta = me.speed * SPEED_MODIFIER;
	if ((87 in keysDown || 38 in keysDown)) { // up
		if(canMove(UP)){
			me.bodyY -= delta;
			changed = 1;
		}
	}
	if ((83 in keysDown || 40 in keysDown)) { // down
		if(canMove(DOWN)){
			me.bodyY += delta;
			changed = 1;
		}
	}
	if ((65 in keysDown || 37 in keysDown)) { // left
		if(canMove(LEFT)){
			me.bodyX -= delta;
			changed = 1;
		}
	}
	if ((68 in keysDown || 39 in keysDown)) { // right
		if(canMove(RIGHT)){
			me.bodyX += delta;
			changed = 1;
		}
	}
	//console.log('(' + me.bodyX + ',' + me.bodyY + ')');
}

function updatePlayer(){
	updateBody();
	updateFront();
	if(changed){
		changed = 0;
		sendPosition();
	}
}

function drawCircle(x,y,radius,start,end,fill,stroke){

	ctx.beginPath();
	ctx.arc(x,y,radius,start,end);
	ctx.fillStyle = fill;
	ctx.fill();
	ctx.lineWidth = 2;
	ctx.strokeStyle = stroke;
	ctx.stroke();
	ctx.closePath();
}
function drawFront(){
	drawCircle(me.frontX,me.frontY,FRONT_RADIUS,0,END,front[ME],frontStroke[ME]);	
}

function drawPlayer(){
	drawCircle(me.bodyX,me.bodyY,BODY_RADIUS,0,END,body[ME],bodyStroke[ME]);
	drawFront();
}

function setMePosition(x,y){
	me.bodyX = x;
	me.bodyY = y;
}

function addListeners(){
	$('body').on('contextmenu', '#myCanvas', function(e){ return false; });
	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);

	$('#myCanvas').mousemove(function(event) {

		changed = 1;

		var parentOffset = canvas.getBoundingClientRect();

		//if(OFFSET_LEFT == -1)
			OFFSET_LEFT = parentOffset.left; 
		//if(OFFSET_TOP == -1)
			OFFSET_TOP = parentOffset.top; 

	   	var relX = event.pageX - OFFSET_LEFT;
	   	var relY = event.pageY - OFFSET_TOP;

	   	mouseX = relX;
		mouseY = relY;
		//console.log('mouse: (' + mouseX + ',' + mouseY + ')');
  		//var msg = 'mousemove() position - x : ' + relX + ', y : ' + relY;
	  	//console.log(msg);
	});

	$('#myCanvas').mousedown(function(event) {

		if(event.button == 0){
			changed = 1;
			fire(mouseX,mouseY);	 
		}	
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
		height:20
	});
	barriers.push({
		x:WIDTH * 4 / 6,
		y:HEIGHT * 3 / 6,
		width:100,
		height:20
	});

	var reflected1 = reflectPoint(barriers[0].x + 100,barriers[0].y + 20);
	var reflected2 = reflectPoint(barriers[1].x + 100,barriers[1].y + 10);
	barriers.push({
		x: reflected1.x,
		y: reflected1.y,
		width: 100,
		height: 20
	});
	barriers.push({
		x: reflected2.x,
		y: reflected2.y,
		width: 100,
		height: 20
	});
	/*
	barriers.push({
		x:WIDTH * 4 / 6,
		y:HEIGHT * 4 / 6,
		width:100,
		height:20
	});
	barriers.push({
		x:WIDTH / 6,
		y:HEIGHT * 5 / 6,
		width:100,
		height:20
	});*/
}

function render(){
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	drawPlayer();
	drawOpponent();
	drawBarriers();
	drawProjectiles(); // projectile.js
}

function update() {
	updatePlayer();
	updateProjectiles(); // projectile.js
};

// The main game loop
function main() {	

	render();
	update(SPEED_MODIFIER);
	

	requestAnimationFrame(main);
};

function initVariables(){
	projectiles = [];
	barriers = [];
	keysDown = {};
	mouseX = canvas.width/2;
	mouseY = canvas.height/2 - 20;

	started = false;
	opponentReady = false;
	waitingForMe = false;
	countdownComplete = false;

	countdownCount = 3;

	me = {
		speed: 128, // movement in pixels per second
		bodyX: -1,
		bodyY: -1,
		frontX: -1,
		frontY: -1
	};

	
	var front = getFront(canvas.width / 2, canvas.height / 6,
								mouseX, mouseY);
		
	
	opponent = {
		bodyX: canvas.width / 2,
		bodyY: canvas.height / 6,
		frontX: front.x,
		frontY: front.y
	};
	addBarriers();
}

function setUp(){
	createCanvas();
	initVariables();
	

	setMePosition(canvas.width/2, canvas.height*5/6);
	drawPlayer();
	drawBarriers();

	started = true;
	if(waitingForMe){
		opponentReady = true;
	}
	if(playersReady()){
		startCountdown();
	}
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