var canvas;
var ctx;


var keysDown = {};
var mouseX = -1;
var mouseY = -1;

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
	canvas.width = 512;
	canvas.height = 480;
	canvas.style.background = "#ffffff"
	canvas.style.border="1px solid #000000";
	document.getElementById("game").appendChild(canvas);
}

function setMePosition(x,y){
	me[bodyX] = x;
	me[bodyY] = y;
}

function drawFront(){
	ctx.beginPath();
	ctx.arc(me[bodyX],me[bodyY] - 21,4,0,2*Math.PI);
	ctx.fillStyle="#FFFF66"
	ctx.fill();
	ctx.lineWidth=2;
	ctx.strokeStyle="#FFFF66"	
	ctx.stroke();
}

function drawBody(){
	ctx.beginPath();
	ctx.arc(me[bodyX],me[bodyY],25,0,2*Math.PI);
	ctx.fillStyle="#00331F";
	ctx.fill();
	ctx.lineWidth=2;
	ctx.strokeStyle="#003300"
	
	ctx.stroke();

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








// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		me.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		me.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		me.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		me.x += hero.speed * modifier;
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
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
	
}
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();