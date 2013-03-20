var io = require('socket.io').listen(5000),
	util = require('util'),
	$ = require('jquery'),
	canvasUsers = {};
//// init all socket connections
io.sockets.on('connection', onSocketConnection);

function onSocketConnection(socket) {
	util.log("Someone has logged onto the website");
	socket.emit('welcome user', "Welcome user " + socket.id);
	
	socket.on('disconnect', 
		function onSocketDisconnection() {
		$.each(canvasUsers, function(key, value) {
			if(value == socket.id) {
				delete canvasUsers[key];
				util.log(JSON.stringify(canvasUsers));
			}
		});
	});
	
	socket.on('canvasId', 
		function onCanvasId(data) {
		canvasUsers[data.id] = socket.id;
		socket.emit('canvasId', data.id);
		util.log(JSON.stringify(canvasUsers));
		});
	
	socket.on('check id',
		function onCheckId(data) {
		util.log(data);
		$.each(canvasUsers, function(key, value) {
			if(key === data) {
				util.log('yes canvas');
				var to = canvasUsers[data];
				io.sockets.socket(to).emit('check in', socket.id);
				socket.emit('checked data', {valid: true, id: data});
			} else if (key == null) {
				util.log('no canvas');
				socket.emit('checked data', false);
			} 
			else {
				util.log('no canvas');
				socket.emit('checked data', false);
			}
		});
		});
	
	socket.on('select role',
		function onSelectRole(data) {
			var to1 = data[0], to2 = data[1];
			io.sockets.socket(to1).emit('select role');
			io.sockets.socket(to2).emit('select role');
		});

	socket.on('user ready',
		function onUserReady(data) {
			var to = canvasUsers[data];
			io.sockets.socket(to).emit('user ready');
		});

	socket.on('shake', 
		function onUserShake(data) {
			var to = canvasUsers[data.id];
			io.sockets.socket(to).emit('run', data.vel);
		});
	socket.on('jumpOrDuck', 
		function onUserJump(data) {
			var to = canvasUsers[data.id];
			io.sockets.socket(to).emit('jumpOrDuck', data.jD);
		});
}