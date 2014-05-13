var PROJECTILE_VELOCITY = 4096;
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

		var deltaX = current.clickedX - me.frontX;
		var deltaY = current.clickedY - me.frontY;
		var angle = Math.atan2(deltaY,deltaX);

		var x = (PROJECTILE_LENGTH * SPEED_MODIFIER) * Math.cos(angle);
		var y = (PROJECTILE_LENGTH * SPEED_MODIFIER) * Math.sin(angle);

		ctx.moveTo(current.positionX,current.positionY);
		ctx.lineTo(current.positionX + x,current.positionY + y);
		ctx.stroke();
	}
}

function updateProjectiles(){
	for(index = 0;index < projectiles.length;index++){
		var current = projectiles[index];
		projectiles[index].positionX += current.run;
		projectiles[index].positionY += current.rise;
	}	
}

function addProjectile(x,y,meX,myY){
	var rise = y - me.bodyY;
	var run = x - me.bodyX;

	projectiles.push({
		clickedX: x,
		clickedY: y,
		positionX: me.frontX,
		positionY: me.frontY,
		rise: rise,
		run: run
	});	
}