var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// serve static html files
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/sem4.html');
});

io.on('connection', function (sock) {
    console.log("Event: client connected");
    console.log('Messages: ', JSON.stringify(messages, null, 2));
    sock.on('disconnect', function () {
        console.log('Event: client disconnected');
    });

    sock.on('get message list', function (cb) {
        console.log("Event: get message list: ");
        getMessageList(function (ml) {
            sock.emit('message list', JSON.stringify(ml), cb);
        });
    });

    sock.on('post message', function (message, from) {
        console.log("Event: post message: ");
        postMessage(message, from, function (newMessage) {
            sock.emit('message posted', JSON.stringify(newMessage));
        });
    });
});

// Listen for connections !!
http.listen(10000, function () {
    console.log("Starting: server current directory:" + __dirname)
});

var messages = [
    { msg: 'primer mensaje', from: 'Foreador', ts: new Date() },
    { msg: 'SEGUNDO mensaje', from: 'Foreador', ts: new Date() }
];

getMessageList = function (cb) {
    cb(messages);
}

postMessage = function (message, from, cb) {
    var newMessage = { msg: message, from: from, ts: new Date() };
    messages.push(newMessage);
    cb(newMessage);
}

