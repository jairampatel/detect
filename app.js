
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

var roomSockets = [];
var players = {};

io.sockets.on('connection', function(socket){
	socket.on('joinRoom',function(data){		
		console.log('joining room: ' + socket.id);
		socket.join('room');
		roomSockets.push(socket.id);
		players[socket.id] = {};
	});
	
	socket.on('ready',function(data){
		var opponent = 0;
		if(roomSockets[0]==socket.id){
			opponent = 1;
		}
		io.sockets.socket(roomSockets[opponent]).emit('opponentReady');
	});

	socket.on('myLocation',function(data){
		console.log('players: ' + players);
		console.log('id: ' + socket.id);
		if(players[socket.id]){
			players[socket.id].bodyX = data.bodyX;
			players[socket.id].bodyY = data.bodyY;

			players[socket.id].frontX = data.frontX;
			players[socket.id].frontY = data.frontY;

			var opponent = 0;
			if(roomSockets[0]==socket.id){
				opponent = 1;
			}
			io.sockets.socket(roomSockets[opponent]).emit('opponentLocation',{
					bodyX: players[socket.id].bodyX,
					bodyY: players[socket.id].bodyY,
					frontX: players[socket.id].frontX,
					frontY: players[socket.id].frontY
			});
		}
	});
});

app.get('/', function (req, res) {
    res.render('home');
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
