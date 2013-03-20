// troll connect
var mobile = 0,
	mobileUser = [],
	userReady = 0;

$('#desktopContainer').fadeIn();
// random id for canvas and send to server

canvasId = Math.floor((Math.random()*10000)+100);
console.log(canvasId);
socket.emit('canvasId', {id: canvasId});
socket.on('canvasId', function(fS) {
	console.log(fS);
	setTimeout(function() {
		$('#canvasId').html('Your game code : ' + fS + "<br>");
	}, 3000);
});

socket.on('check in', function(data) {
	console.log("poked by" + "/" +  data + "/" + "connect");
	if(mobile < 2) {
		console.log("this canvas still available");
		socket.emit('userAmount', mobile);
		mobile++;
		console.log(mobile);
		mobileUser.push(data);
		console.log(mobileUser);
		$('.mobileConnect').html(2 - mobile + " more");
		
		// bring user to select role if all connected
		if(mobile === 2) {
		console.log('2 trolls connected');
		socket.emit('select role', mobileUser);
		$('#inputId').fadeOut();
		$('#connectionAwait').fadeOut();
		$('#footer').html('One troll will be a runner, one will be a jumper. Follow the instruction, trolls!');
		$('#canvasId').html('YESSS!!, Now choose your role. LOL.');
	}
	}
});

socket.on('user ready', function() {
		userReady++;
		// if 2 players joined and game is ready
		if(mobile == 2 && userReady == 2) {
		$('#content').fadeOut();
		window.onReady(function() {
			$("#canvasContainer").show();
			TrollympicsGame.onload();
		});
		$('#canvasContainer').animate({'opacity': 1});
	}
	});

// bootstrap
