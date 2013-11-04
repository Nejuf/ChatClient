module.exports.createChat = function (server) {
  var io = require('socket.io').listen(server),
  fs = require('fs');

  server.listen(80);
  io.sockets.on('connection', function(socket) {

    socket.on('new_message', function(data) {
      io.sockets.emit('message', data);
    });
  });
}