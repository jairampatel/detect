var PROJECTILE_LENGTH = 12;

var projectiles;
var id = 0;
var ids = [];
var allIds = [];



function linesIntersect(x1, y1, x2, y2, x3, y3, x4, y4){
	var a1, a2, b1, b2, c1, c2; /* Coefficients of line eqns. */
    var r1, r2, r3, r4;         /* 'Sign' values */
    var denom, offset, num;     /* Intermediate values */

    x1 += OFFSET_LEFT;
    x2 += OFFSET_LEFT;
    x3 += OFFSET_LEFT;
    x4 += OFFSET_LEFT;

    y1 += OFFSET_TOP;
    y2 += OFFSET_TOP;
    y3 += OFFSET_TOP;
    y4 += OFFSET_TOP;

    /* Compute a1, b1, c1, where line joining points 1 and 2
     * is "a1 x  +  b1 y  +  c1  =  0".
     */

    a1 = y2 - y1;
    b1 = x1 - x2;
    c1 = x2 * y1 - x1 * y2;

    /* Compute r3 and r4.
     */


    r3 = a1 * x3 + b1 * y3 + c1;
    r4 = a1 * x4 + b1 * y4 + c1;

    /* Check signs of r3 and r4.  If both point 3 and point 4 lie on
     * same side of line 1, the line segments do not intersect.
     */

    if ( r3 != 0 && r4 != 0 && ( (r3 > 0 && r4 > 0) || (r3 < 0 && r4 < 0) ))
        return false;

    /* Compute a2, b2, c2 */

    a2 = y4 - y3;
    b2 = x3 - x4;
    c2 = x4 * y3 - x3 * y4;

    /* Compute r1 and r2 */

    r1 = a2 * x1 + b2 * y1 + c2;
    r2 = a2 * x2 + b2 * y2 + c2;

    /* Check signs of r1 and r2.  If both point 1 and point 2 lie
     * on same side of second line segment, the line segments do
     * not intersect.
     */

    if ( r1 != 0 &&
         r2 != 0 &&
         ( (r1 > 0 && r2 > 0) || (r1 < 0 && r2 < 0) ))
        return false;

    return true;
}

function lineIntersectsRectangle(width,height,x1, y1, x3, y3, x4, y4){
	if((linesIntersect(x1,y1,
						x1,y1 + height,
							x3,y3,
								x4,y4)) ||
			(linesIntersect(x1,y1,
						x1 + width, y1,
							x3,y3,
								x4,y4)) ||
			(linesIntersect(x1 + width,y1 + height,
						x1,y1 + height,
							x3,y3,
								x4,y4)) ||
			(linesIntersect(x1 + width,y1 + height,
						x1 + width,y1,
							x3,y3,
								x4,y4))) {
			return true;
		}
	return false;
}
function projectileIntersectsBarriers(currentProjectile){
	var index;
	for(index = 0;index < barriers.length;index++){
		var current = barriers[index];
		if(lineIntersectsRectangle(current.width,current.height,
									current.x,current.y,
										currentProjectile.positionX, currentProjectile.positionY,
											currentProjectile.endPositionX,currentProjectile.endPositionY)){
			return true;
		}
	}
	return false;
}

function projectileIntersectsWall(currentProjectile){
	if(lineIntersectsRectangle(WIDTH,HEIGHT,
								0,0,
									currentProjectile.positionX,currentProjectile.positionY,
										currentProjectile.endPositionX,currentProjectile.endPositionY)){
		return true;
	}
	return false;
}

function lineIntersectsCircle(currentProjectile,bodyX,bodyY){
	// compute the euclidean distance between A and B
	var Ax = currentProjectile.positionX;
	var Ay = currentProjectile.positionY;
	var Bx = currentProjectile.endPositionX;
	var By = currentProjectile.endPositionY;

	var a = (Bx - Ax) * (Bx - Ax) + (By - Ay) * (By - Ay);
	var b = 2 * ((Bx - Ax) * (Ax - bodyX) +(By - Ay) * (Ay - bodyY));
	var cc = bodyX * bodyX + bodyY * bodyY + Ax * Ax + Ay * Ay - 2 * (bodyX * Ax + bodyY * Ay) - BODY_RADIUS * BODY_RADIUS;
	
	var deter = b * b - 4 * a * cc;
	if (deter <= 0 ) {
		//inside = false;
		return false;
	} else {
		var e = Math.sqrt(deter);
		var u1 = ( (-1 * b) + e ) / (2 * a );
		var u2 = ( (-1 * b) - e ) / (2 * a );
		if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {
			if ((u1 < 0 && u2 < 0) || (u1 > 1 && u2 > 1)) {
				//result.inside = false;
				return false;
			} else {
				//result.inside = true;
				return true;
			}
		} else {
			/*if (0 <= u2 && u2 <= 1) {
				result.enter=Point.interpolate (A, B, 1 - u2);
			}
			if (0 <= u1 && u1 <= 1) {
				result.exit=Point.interpolate (A, B, 1 - u1);
			}
			result.intersects = true;
			if (result.exit != null && result.enter != null && result.exit.equals (result.enter)) {
				result.tangent = true;
			}*/
			return true;	
		}
	}
	return false;
	
}
function projectileIntersectsMe(currentProjectile) {
    if(lineIntersectsCircle(currentProjectile,me.bodyX,me.bodyY)){
    	return true;
    }
    return false;
}

function projectileIntersectsOpponent(currentProjectile) {
	if(lineIntersectsCircle(currentProjectile,opponent.bodyX,opponent.bodyY)){
		return true;
	}
	return false;   
}

function removeProjectile(id){
	var index;
	index = ids.indexOf(id);
	if(index >= 0){
		projectiles.splice(index,1);
		ids.splice(index,1);
	}
}
function handleProjectiles(){
	var index;
	for(index = projectiles.length - 1;index >= 0;index--){
		var currentProjectile = projectiles[index];
		if(projectileIntersectsBarriers(currentProjectile) || 
				projectileIntersectsWall(currentProjectile)){
			projectiles.splice(index,1);
			ids.splice(index,1);
		}
		else if( projectileIntersectsMe(currentProjectile)){
			console.log('i got hit');
			var id = ids[index] * -1;

			projectiles.splice(index,1);
			ids.splice(index,1);
			incrementScore("#opponentScore");
			
			sendHit(id);
		}
/*
		if(projectileIntersectsOpponent(currentProjectile)){
			console.log('opponent got hit');
			projectiles.splice(index,1);
			ids.splice(index,1);
			incrementScore("#myScore");
		}*/
	}
}

function drawProjectiles(){
	var index;

	
	ctx.strokeStyle="black";
	for(index = 0;index < projectiles.length;index++){

		//console.log('drawing projectile 1');
		var current = projectiles[index];

		ctx.moveTo(current.positionX,current.positionY);
		ctx.lineTo(current.positionX + current.deltaX,current.positionY + current.deltaY);
		ctx.stroke();
	}
}

function updateProjectiles(){
	for(index = 0;index < projectiles.length;index++){
		var current = projectiles[index];
		projectiles[index].positionX += current.deltaX;
		projectiles[index].positionY += current.deltaY;

		projectiles[index].endPositionX += current.deltaX;
		projectiles[index].endPositionY += current.deltaY;
	}	
	handleProjectiles();
}

function addProjectiles(idArray, projArray){
	var i;
	for(i = 0;i < idArray.length;i++){
		if(allIds.indexOf(idArray[i]) < 0){
			allIds.push(idArray[i]);
			ids.push(idArray[i]);
			projectiles.push(projArray[i]);
		}
	}
}
function getId(){
	id++;
	return id;
}
function getIds(){
	return ids;
}
function getProjectiles(){
	return projectiles;
}
function addProjectile(x,y,meX,meY){

	var deltaX = (x) - (meX);
	var deltaY = (y) - (meY);
	var angle = Math.atan2(deltaY,deltaX);

	var x = (BODY_RADIUS + 2) * Math.cos(angle);
	var y = (BODY_RADIUS + 2) * Math.sin(angle);

	var i = getId();
	allIds.push(i);
	ids.push(i);
	projectiles.push({
		positionX: me.frontX,
		positionY: me.frontY,
		endPositionX: me.frontX + x,
		endPositionY: me.frontY + y,
		deltaX: x,
		deltaY: y
	});	
}