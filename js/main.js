// Socket init

var socket = io.connect('http://ec2-54-245-151-226.us-west-2.compute.amazonaws.com:5000');
socket.on('welcome user', function(fS) {
	console.log(fS);
});
