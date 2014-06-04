var room = exports;

var rooms = {};

function isPresent(room,id){
	var index;

	for(index = 0;index < rooms[room].length;index++){
		if(rooms[room][index].id == id){
			return true;
		}
	}
	return false;
}
function addToRoom(room,id,nickname){
	rooms[room].push({
		id: id,
		nickname: nickname, 
		bodyX: -1,
		bodyY: -1,
		frontX: -1,
		frontY: -1,
		ready: false
	});
}
room.joinRoom = function(room,nickname,id){
	if(!rooms[room]){
		rooms[room] = []
	}
	//TODO 2 Allow others can view game. Limit moves to the first 2
	if(rooms[room].length > 0){		
		if(!isPresent(room,id)){
			addToRoom(room,id,nickname);
		}
	}
	else{
		addToRoom(room,id,nickname);
	}
	
}

room.hit = function(room,id){
	var opponent = -1;

	if(rooms[room][0].id == id){
		opponent = 1;
	}
	else if(rooms[room][1].id == id){
		opponent = 0;
	}
	//console.log('opponent: ' + opponent);
	if(opponent != -1){
		return rooms[room][opponent].id;
	}
	else{
		return -1;
	}
}

room.ready = function(room,id){
	var me = -1;
	var opponent = -1;
	if(rooms[room][0].id == id){
		me = 0;
	}
	else if(rooms[room][1] && rooms[room][1].id == id){
		me = 1;
	}

	//console.log('opponent: ' + opponent);
	if(me != -1){
		opponent = me ^ 1;
		rooms[room][me].ready = true;
	

		if(rooms[room][opponent] && rooms[room][me].ready && rooms[room][opponent].ready){
			return {
				ready: true,
				meId: rooms[room][me].id,
				opponentId: rooms[room][opponent].id,
				meNickname: rooms[room][me].nickname,
				opponentNickname: rooms[room][opponent].nickname
			}
		}
		else{
			return {
				ready: false
			}
		}
	}
	else{
		return {
			ready: false
		}
	}
}

room.myLocation = function(room, id, bodyX, bodyY, frontX, frontY){
	var me = -1;

	if(rooms[room] && rooms[room].length >= 1){
		if(rooms[room][0] && rooms[room][0].id==id){
			me = 0;
		}
		else if(rooms[room][1] && rooms[room][1].id==id){
			me = 1;
		}
	}

	if(me != -1){
		rooms[room][me].bodyX = bodyX;
		rooms[room][me].bodyY = bodyY;

		rooms[room][me].frontX = frontX;
		rooms[room][me].frontY = frontY;

		var opponent = me ^ 1;
		if(rooms[room].length > 1 && rooms[room][opponent]){
			return rooms[room][opponent].id;
		}
		else{
			return -1;
		}
	}
	else{
		return -1;
	}
}