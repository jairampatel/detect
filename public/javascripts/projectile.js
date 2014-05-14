var PROJECTILE_LENGTH = 12;

var projectiles;

function projectileIntersectsBarriers(currentProjectile){
	var index;
	for(index = 0;index < barriers.length;index++){
		// TODO1
	}
	return false;
}

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
function projectileIntersectsWall(currentProjectile){
	if((linesIntersect(0,0,
						0,HEIGHT,
							currentProjectile.positionX,currentProjectile.positionY,
								currentProjectile.endPositionX,currentProjectile.endPositionY)) ||
		(linesIntersect(0,0,
						WIDTH,0,
							currentProjectile.positionX,currentProjectile.positionY,
								currentProjectile.endPositionX,currentProjectile.endPositionY)) ||
		 (linesIntersect(WIDTH,HEIGHT,
						0,HEIGHT,
							currentProjectile.positionX,currentProjectile.positionY,
								currentProjectile.endPositionX,currentProjectile.endPositionY)) ||
		  (linesIntersect(WIDTH,HEIGHT,
						WIDTH,0,
							currentProjectile.positionX,currentProjectile.positionY,
								currentProjectile.endPositionX,currentProjectile.endPositionY))){
		  	return true;
	}
	return false;
}
function projectileIntersectsPlayer(currentProjectile){
	// TODO2
	return false;
}

function handleProjectiles(){
	var index;
	for(index = projectiles.length - 1;index >= 0;index--){
		var currentProjectile = projectiles[index];
		if(projectileIntersectsBarriers(currentProjectile) || 
				projectileIntersectsWall(currentProjectile)){
			projectiles.splice(index,1);
		}

		if(projectileIntersectsPlayer(currentProjectile)){
			// TODO2 notify player
		}
	}
}

function drawProjectiles(){
	var index;

	handleProjectiles();
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
}

function addProjectile(x,y,meX,myY){

	var deltaX = (x) - (meX);
	var deltaY = (y) - (myY);
	var angle = Math.atan2(deltaY,deltaX);

	var x = (BODY_RADIUS + PROJECTILE_LENGTH) * Math.cos(angle);
	var y = (BODY_RADIUS + PROJECTILE_LENGTH) * Math.sin(angle);

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