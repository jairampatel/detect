var body = ["#00331F","#0066FF"];
var bodyStroke = ["#003300","#0000FF"];

var front = ["#FFFF66","#FFFF66"];
var frontStroke = ["#FFFF66","#FFFF66"];

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

function setOpponent(bodyX, bodyY, frontX, frontY){
	opponent.bodyX = bodyX;
	opponent.bodyY = bodyY;
	opponent.frontX = frontX;
	opponent.frontY = frontY;
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

function setMePosition(x,y){
	me.bodyX = x;
	me.bodyY = y;
}