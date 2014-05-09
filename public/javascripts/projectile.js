var PROJECTILE_VELOCITY = 256;
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
	// TODO1
	return false;
}

function handleProjectiles(){
	var index;
	for(index = 0;index < projectiles.length;index++){
		var currentProjectile = projectile[index];
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
	//console.log('drawing projectiles');
	var index;

	handleProjectiles();

	for(index = 0;index < projectiles.length;index++){
		// TODO1 draw the projectile
	}
}

function updateProjectiles(){
	for(index = 0;index < projectiles.length;index++){
		// TODO1 advance the projectile based on direction and velocity
	}	
}