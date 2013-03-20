/Mobile/.test(navigator.userAgent) && !location.hash && setTimeout(function () {
    if (!pageYOffset) window.scrollTo(0, 1);
}, 1000);

// Prevent from scrolling
document.ontouchmove = function(event) {
event.preventDefault();
};

// game state 
var gameState;

var canvasId; // game session
// Player choose their role
var playerRole; // 1 is runner, 2 is jumper
var shakeCount = 0;
var jumpOrDuck = 0; // 0 = running state, 1 = jumping state, 2 = ducking state

// Load Mobile Stuff
$('#mobileContainer').fadeIn();
alert('FOR MAXIMUM GAMEPLAY EXPERIENCE: please vertically lock your device');

$('.noCode').click(function() {
	alert("Go to http://bit.ly/trollympics from your computer!, troll!");
});

$('#inputId').click(function() {
	canvasIdInput();
});

function canvasIdInput() {
	canvasId = prompt("Please enter the game session");
	if(canvasId !== null){
	socket.emit('check id', canvasId);
	}
	// check if canvasId is valid
	socket.on('checked data', function(data) {
		if(data.valid == true) {
			canvasId = data.id;
			console.log(canvasId);
			// proceed to choose role
			$('#inputId').fadeOut();
			$('.noCode').html("Challenge Accepted, waiting for one more Trollympian");
		}
	});
	socket.on('room full', function(data) {
		if(data == true) {
			alert('your game room is full. Probably means someone has just trolled you!');
		}
	});
}

socket.on('select role', function() {
		$('#inputId').html('Ready !');
		$('.noCode').fadeOut();
		$('#roleSelector').fadeIn();
	});

$('#userReady').click(function() {
	$('#contentMobile').fadeOut();
	if(playerRole == 1) {
		$('#bg').css({
			'backgroundColor': 'red'
		});
		$('#howToRun').fadeIn();
	} else if (playerRole == 2) {
		$('#bg').css({
			'backgroundColor': 'green'
		});
		$('#howToJump').fadeIn();
	}
	socket.emit('user ready', canvasId);
});

/* $('#debug').html("grab the game code by open http://bit.ly/trollympics in your computer"); */
$('#roleRun').click(function() {
	$('#shakeCounter').fadeIn();
	$('#jumpOrDuck').fadeOut();
	$(this).toggleClass('toggled');
	$('#roleJump').removeClass('toggled');
	playerRole = 1;
	shakeCount = 0;
	window.addEventListener('devicemotion', runHandler, false);
	window.removeEventListener('devicemotion', jumpHandler, false);
});
$('#roleJump').click(function() {
	$('#jumpOrDuck').fadeIn();
	$('#shakeCounter').fadeOut();
	$(this).toggleClass('toggled');
	$('#roleRun').removeClass('toggled');
	playerRole = 2;
	window.addEventListener('devicemotion', jumpHandler, false);
	window.removeEventListener('devicemotion', runHandler, false);
});
var vel = 0;
setInterval(function() {
	shakeCount -= 50;
	if (shakeCount <= 0) {
		shakeCount = 0;
	}
}, 1000);

function runHandler(eventData) {
	// Grab the acceleration including gravity from the results
	var acceleration = eventData.accelerationIncludingGravity;
	// Display the raw acceleration data
	var rawAcceleration = "[" + Math.round(acceleration.x) + ", " + Math.round(acceleration.y) + ", " + Math.round(acceleration.z) + "]";
	// Z is the acceleration in the Z axis, and if the device is facing up or down
	var facingUp = -1;
	if (acceleration.z > 0) {
		facingUp = +1;
	}
	var tiltLR = Math.round(((acceleration.x) / 9.81) * -90);
	var tiltFB = Math.round(((acceleration.y + 9.81) / 9.81) * 90 * facingUp);
	$('#debug').html("L-R: " + tiltLR + ", F-B: " + tiltFB);
	if (tiltFB > 100 || tiltLR > 100) {
		shakeCount += 1.5;
		vel = (shakeCount).toFixed(2);
		socket.emit('shake', {id: canvasId, role: playerRole, vel: vel});
	}
	if (tiltFB > 150 || tiltLR > 150) {
		shakeCount += 3;
		vel = (shakeCount).toFixed(2);
		socket.emit('shake', {id: canvasId, role: playerRole, vel: vel});
	}
	if (tiltFB > 200 || tiltLR > 200) {
		shakeCount += 4;
		vel = (shakeCount).toFixed(2);
		socket.emit('shake', {id: canvasId, role: playerRole, vel: vel});
	}
	if (tiltFB > 300 || tiltLR > 300) {
		shakeCount += 6;
		vel = (shakeCount).toFixed(2);
		socket.emit('shake', {id: canvasId, role: playerRole, vel: vel});
	}
	if (titlFB < 100 || tiltLR < 100) {}
}
socket.on('run', function(fS) {
	$('.count').html(fS + " shake/s");
});

function jumpHandler(eventData) {
	// Grab the acceleration including gravity from the results
	var acceleration = eventData.accelerationIncludingGravity;
	// Display the raw acceleration data
	var rawAcceleration = "[" + Math.round(acceleration.x) + ", " + Math.round(acceleration.y) + ", " + Math.round(acceleration.z) + "]";
	// Z is the acceleration in the Z axis, and if the device is facing up or down
	var facingUp = -1;
	if (acceleration.z > 0) {
		facingUp = +1;
	}
	var tiltLR = Math.round(((acceleration.x) / 9.81) * -90);
	var tiltFB = Math.round(((acceleration.y + 9.81) / 9.81) * 90 * facingUp);
	if (tiltLR < -90 || tiltFB > 90) {
		jumpOrDuck = 1;
		socket.emit('jumpOrDuck', {id: canvasId, role: playerRole, jD: jumpOrDuck});
		$('.jDaction').html("JUMPING!");
		setTimeout(function() {
			jumpOrDuck = 0;
		}, 500);
	} else {
		$('.jDaction').html("RUNNING!");
	}
}