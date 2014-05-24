var PROJECTILE_LENGTH = 12;

var projectiles;
var id = 0;
var ids = [];


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

	var distance = Math.sqrt(Math.pow((Bx-Ax),2)+Math.pow((By-Ay),2));

	// compute the direction vector D from A to B
	var Dx = (Bx-Ax)/distance;
	var Dy = (By-Ay)/distance

	// Now the line equation is x = Dx*t + Ax, y = Dy*t + Ay with 0 <= t <= 1.

	// compute the value t of the closest point to the circle center (Cx, Cy)
	var t = Dx*(bodyX-Ax) + Dy*(bodyY-Ay);

	// This is the projection of C on the line from A to B.

	// compute the coordinates of the point E on line and closest to C
	var Ex = t*Dx+Ax
	var Ey = t*Dy+Ay

	// compute the euclidean distance from E to C
	distance = Math.sqrt( Math.pow((Ex-bodyX),2) + Math.pow((Ey-bodyY),2) )

	// test if the line intersects the circle
	if( distance < BODY_RADIUS )
	{
		return true;
	}

	// else test if the line is tangent to circle
	else if( distance == BODY_RADIUS )
	    return true;

	else
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

function incrementScore(id){
	var score = parseInt($(id).text());
	score += 1;
	$(id).html(score);
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

		if(projectileIntersectsMe(currentProjectile)){
			projectiles.splice(index,1);
			ids.splice(index,1);
			incrementScore("#opponentScore");
		}

		if(projectileIntersectsOpponent(currentProjectile)){
			projectiles.splice(index,1);
			ids.splice(index,1);
			incrementScore("#myScore");
		}
	}
}

function drawProjectiles(){
	var index;

	
	ctx.strokeStyle="black";
	for(index = 0;index < projectiles.length;index++){

		console.log('drawing projectile 1');
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
	}	
	handleProjectiles();
}

function addProjectiles(idArray, projArray){
	var i;
	for(i = 0;i < idArray.length;i++){
		if(ids.indexOf(idArray[i]) < 0){
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
function addProjectile(x,y,meX,myY){

	var deltaX = (x) - (meX);
	var deltaY = (y) - (myY);
	var angle = Math.atan2(deltaY,deltaX);

	var x = (BODY_RADIUS + PROJECTILE_LENGTH) * Math.cos(angle);
	var y = (BODY_RADIUS + PROJECTILE_LENGTH) * Math.sin(angle);

	var i = getId();
	ids.push(i);
	projectiles.push({
		clickedX: x,
		clickedY: y,
		positionX: me.frontX,
		positionY: me.frontY,
		endPositionX: me.frontX + x,
		endPositionY: me.frontY + y,
		deltaX: x,
		deltaY: y
	});	
}