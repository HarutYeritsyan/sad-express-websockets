var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('A user connected');
  io.emit('system message', 'A user connected');
  socket.on('disconnect', function () {
    console.log('User disconnected');
    io.emit('system message', 'User disconnected');
  });
  socket.on('chat message', function (msg, nickname) {
    console.log('message: ' + msg + ' from :' + nickname);
    io.emit('chat message', msg, nickname);
  });
});

http.listen(3000, function () {
  console.log('listening on localhost:3000');
});
