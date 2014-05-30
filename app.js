
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var exphbs  = require('express3-handlebars');

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
var rooms = {};

io.sockets.on('connection', function(socket){
	socket.on('joinRoom',function(data){		
		var room = data.room;
		var nickname = data.nickname;
		//console.log('room: ' + room);
		if(!rooms[room]){
			rooms[room] = []
		}
		//TODO 2 Allow others can view game. Limit moves to the first 2
		rooms[room].push({
			id: socket.id,
			nickname: nickname, 
			bodyX: -1,
			bodyY: -1,
			frontX: -1,
			frontY: -1,
			ready: false
		});
	});
	socket.on('disconnect', function (data) {
        console.log('1 client left');        
        //TODO1 handle user disconnect
    });
    socket.on('hit', function (data) {
        var room = data.room;
        var opponent = -1;
        var id = data.projectileId;

        if(rooms[room][0].id == socket.id){
			opponent = 1;
		}
		else if(rooms[room][1].id == socket.id){
			opponent = 0;
		}
		//console.log('opponent: ' + opponent);
		if(opponent != -1){
			io.sockets.socket(rooms[room][opponent].id).emit('opponentHit',{
				projectileId: id
			});
		}
    });
	socket.on('ready',function(data){
		
		var room = data.room;
		var opponent = -1;
		var me = -1;
		while(rooms[room].length < 1){} // TODO do this another way - if user clicks start before joinRoom is received
		if(rooms[room][0].id == socket.id){
			me = 0;
		}
		else if(rooms[room][1] && rooms[room][1].id == socket.id){
			me = 1;
		}

		//console.log('opponent: ' + opponent);
		if(me != -1){
			opponent = me ^ 1;
			rooms[room][me].ready = true;
		}
		if(rooms[room].length > 1){
			if(rooms[room][me].ready && rooms[room][opponent].ready){
				io.sockets.socket(rooms[room][me].id).emit('startGame',{
					nickname: rooms[room][opponent].nickname
				});
				io.sockets.socket(rooms[room][opponent].id).emit('startGame',{
					nickname: rooms[room][me].nickname
				});
			}
		}
	});

	socket.on('myLocation',function(data){

		var room = data.room;
		var me = -1;

		if(rooms[room] && rooms[room].length >= 1){
			if(rooms[room][0] && rooms[room][0].id==socket.id){
				me = 0;
			}
			else if(rooms[room][1] && rooms[room][1].id==socket.id){
				me = 1;
			}
		}
		if(me != -1){
			//console.log('received: (' + data.bodyX + ',' + data.bodyY + ')');
			rooms[room][me].bodyX = data.bodyX;
			rooms[room][me].bodyY = data.bodyY;

			rooms[room][me].frontX = data.frontX;
			rooms[room][me].frontY = data.frontY;

			var opponent = me ^ 1;
			if(rooms[room].length > 1 && rooms[room][opponent]){
				io.sockets.socket(rooms[room][opponent].id).emit('opponentLocation',{
						bodyX: rooms[room][me].bodyX,
						bodyY: rooms[room][me].bodyY,
						frontX: rooms[room][me].frontX,
						frontY: rooms[room][me].frontY,
						projectiles: data.projectiles,
						ids: data.ids
				});
			}
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
