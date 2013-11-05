module.exports.createChat = function (server) {
  var io = require('socket.io').listen(server),
  fs = require('fs');
  var guestNumber = 1;
  var nicknames = {};
  var namesUsed = {};

  server.listen(80);
  io.sockets.on('connection', function(socket) {
    socket.on('new_message', function(data) {

      if( !nicknames[socket.id] ) {
        nicknames[socket.id] = "guest_" + guestNumber.toString();
        guestNumber++;
      }

      io.sockets.emit('message', nicknames[socket.id]+": "+ data);
    });

    socket.on('nicknameChangeRequest', function(data) {

      if(data.substr(0, 5).toLowerCase() == "guest") {
        socket.emit('message', "nickname cannot begin with \"guest\"");
      }
      else if(namesUsed[data] === socket.id || namesUsed[data] == undefined){
        // io.sockets.emit('nicknameChangeResult', data)
        if( !nicknames[socket.id] ) {
          nicknames[socket.id] = "guest_" + guestNumber.toString();
          guestNumber++;
        }
        var prevName = nicknames[socket.id];

        nicknames[socket.id] = data;
        namesUsed[data] = socket.id;

        io.sockets.emit('message', prevName + " changed nickname to: " + data);
      }
      else {
        socket.emit('message', nicknames[socket.id] + " cannot change nickname to: " + data);
      }
    });

    socket.on('disconnect', function() {
      var name = nicknames[socket.id];
      delete nicknames[socket.id];
      for(var prop in namesUsed){
        if(namesUsed[prop] == socket.id) {
          delete namesUsed[prop];
        }
      }

      io.sockets.emit("message", name + " has left the chat.");
    });
  });

}