var PROJECTILE_LENGTH = 8;
var PROJECTILE_VELOCITY = 2;
var projectiles;

function projectileIntersectsBarriers(currentProjectile){
	// TODO1
	return false;
}

function projectileIntersectsWall(currentProjectile){
	// TODO1
	return false;
}
function projectileIntersectsPlayer(currentProjectile){
	// TODO2
	return false;
}

function handleProjectiles(){
	var index;
	for(index = 0;index < projectiles.length;index++){
		var currentProjectile = projectiles[index];
		if(projectileIntersectsBarriers(currentProjectile) || 
				projectileIntersectsWall(currentProjectile)){
			// TODO1 remove projectile
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
		var current = projectiles[index];

		ctx.moveTo(current.positionX,current.positionY);
		ctx.lineTo(current.positionX + current.deltaX,current.positionY + current.Y);
		ctx.stroke();

		current.positionX += current.deltaX;
		current.positionY += current.deltaY;
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
		deltaX: deltaX,
		deltaY: deltaY
	});	
}