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