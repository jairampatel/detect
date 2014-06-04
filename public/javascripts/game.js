var canvas;
var ctx;

var countInProcess;
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

var ME = 0;
var OPPONENT = 1;

var connected = 0;


function startCountdown(){
	console.log('starting countdown');
	countInProcess = true;
	countdown = setInterval(updateCountdown,1000);
}
function updateCountdown(){
	console.log('count: ' + countdownCount);
	if(countdownCount > 0){
		ctx.clearRect(WIDTH / 2 - 20,HEIGHT / 2 - 20,100,100);
		ctx.fillStyle="#000000";
		ctx.font="20px Georgia";
		ctx.fillText(countdownCount,WIDTH / 2, HEIGHT / 2);
		countdownCount--;
	}
	else{
		stopCountdown();
	}
}
function stopCountdown(){
	clearInterval(countdown);
	countdownComplete = true;
	countInProcess = false;
	addListeners();
}

function incrementScore(id){
	var score = parseInt($(id).text());
	score += 1;
	$(id).html(score);
}

function canStart(){
	return countdownComplete;
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
	/*barriers.push({
		x:WIDTH * 4 / 6,
		y:HEIGHT * 3 / 6,
		width:100,
		height:20
	});*/

	var reflected1 = reflectPoint(barriers[0].x + 100,barriers[0].y + 20);
	//var reflected2 = reflectPoint(barriers[1].x + 100,barriers[1].y + 10);
	barriers.push({
		x: reflected1.x,
		y: reflected1.y,
		width: 100,
		height: 20
	});
	/*barriers.push({
		x: reflected2.x,
		y: reflected2.y,
		width: 100,
		height: 20
	});*/
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
	if(!countInProcess){
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		
		drawPlayer();
		drawOpponent();
		drawBarriers();
		drawProjectiles(); // projectile.js
	}
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

	countdownCount = 3;
	countInProcess = false;

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
}

function startGame(){
	if(!canStart()){
		setUp();
		main();
	}
}

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;