
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var exphbs  = require('express3-handlebars');

var room = require('./js/room.js');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


/*
	rooms[roomName] = [
		{
			id: id1,
			bodyX: bodyX,
			bodyY: bodyY,
			frontX: frontX,
			frontY: frontY
		}
	]
*/


io.sockets.on('connection', function(socket){
	socket.on('joinRoom',function(data){	

		var roomParam = data.room;
		var nickname = data.nickname;

		room.joinRoom(roomParam,nickname,socket.id);	
		//console.log('room: ' + room);
		
	});
	socket.on('disconnect', function (data) {
        console.log('1 client left');        
        //TODO1 handle user disconnect
    });
    socket.on('hit', function (data) {
        var roomParam = data.room;
        var id = data.projectileId;

        var opponentId = room.hit(roomParam,socket.id);

        if(opponentId != -1){
        	io.sockets.socket(opponentId).emit('opponentHit',{
				projectileId: id
			});
        }
        
    });
	socket.on('ready',function(data){
		
		var roomParam = data.room;
		var opponent = -1;
		
		//while(rooms[room].length < 1){} // TODO do this another way - if user clicks start before joinRoom is received

		var result = room.ready(roomParam,socket.id);

		
		if(result.ready == true){
			io.sockets.socket(result.meId).emit('startGame',{
				nickname: result.opponentNickname
			});
			io.sockets.socket(result.opponentId).emit('startGame',{
				nickname: result.meNickname
			});			
		}
	});

	socket.on('myLocation',function(data){

		var roomParam = data.room;
		var bodyX = data.bodyX;
		var bodyY = data.bodyY;
		var frontX = data.frontX;
		var frontY = data.frontY;

		var opponentId = room.myLocation(roomParam,socket.id,bodyX, bodyY, frontX, frontY);

		
		if(opponentId != -1){
			io.sockets.socket(opponentId).emit('opponentLocation',{
					bodyX: bodyX,
					bodyY: bodyY,
					frontX: frontX,
					frontY: frontY,
					projectiles: data.projectiles,
					ids: data.ids
			});
		}
	});
});

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/play',function(req,res){
	res.render('play',{
		nickname: req.query.nickname,
		room: req.query.room
	});
});

server.listen(app.get('port'), function(){
});
