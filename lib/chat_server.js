module.exports.createChat = function (server) {
  var io = require('socket.io').listen(server),
  fs = require('fs');

  server.listen(80);

  io.sockets.on('connection', function(socket) {
    socket.on('new message', function(data) {
      console.log(data);
      io.sockets.emit('message', {text: data});
    });
  });
}