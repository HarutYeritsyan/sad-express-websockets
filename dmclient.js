var net = require('net');
var HOST = '127.0.0.1';
var PORT = 9000;
var client = new net.Socket();

client.connect(PORT, HOST, function () {
	console.log('CONNECTED TO: ' + HOST + ':' + PORT);
});

var ml_callback;

client.on('data', function (data) {
	console.log('data comes in: ' + data);
	var reply = JSON.parse(data.toString());
	switch (reply.what) {
		case 'get message list':
			console.log('We received the message list');
			ml_callback(reply.obj);
			break;
		case 'post message':
			console.log('We sent a message');
			ml_callback(reply.obj);
			break;
		default:
			console.log("Panic: we got this: " + reply.what);
	}
});

exports.getMessageList = function (cb) {
	var cmd = { what: 'get message list' };
	ml_callback = cb;
	client.write(JSON.stringify(cmd));
}

exports.postMessage = function (msg, from, cb) {
	var cmd = { what: 'post message', msg: msg, from: from };
	ml_callback = cb;
	client.write(JSON.stringify(cmd));
}

// Add a 'close' event handler for the client socket
client.on('close', function () {
	console.log('Connection closed');
});
