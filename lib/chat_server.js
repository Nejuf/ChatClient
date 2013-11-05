module.exports.createChat = function (server) {
  var io = require('socket.io').listen(server),
  fs = require('fs');
  var guestNumber = 1;
  var nicknames = {};
  var namesUsed = {};
  var currentRooms = {};

  server.listen(80);
  io.sockets.on('connection', function(socket) {
    if( !nicknames[socket.id] ) {
      nicknames[socket.id] = "guest_" + guestNumber.toString();
      guestNumber++;
    }
    joinRoom(socket);

    socket.on('new_message', function(data) {

      io.sockets.in(currentRooms[socket.id]).emit('message', currentRooms[socket.id] + "#" +nicknames[socket.id]+": "+ data);
    });

    socket.on('nicknameChangeRequest', function(data) {

      if(data.substr(0, 5).toLowerCase() == "guest") {
        socket.in(currentRooms[socket.id]).emit('message', currentRooms[socket.id] + "#nickname cannot begin with \"guest\"");
      }
      else if(namesUsed[data] === socket.id || namesUsed[data] == undefined){
        var prevName = nicknames[socket.id];

        nicknames[socket.id] = data;
        namesUsed[data] = socket.id;

        io.sockets.in(currentRooms[socket.id]).emit('message', currentRooms[socket.id] + "#" + prevName + " changed nickname to: " + data);
      }
      else {
        socket.in(currentRooms[socket.id]).emit('message', currentRooms[socket.id] + "#" +nicknames[socket.id] + " cannot change nickname to: " + data);
      }
    });

    socket.on('roomChangeRequest', function(data) {
      joinRoom(socket, data);
    });

    socket.on('disconnect', function() {
      var name = nicknames[socket.id];
      delete nicknames[socket.id];
      for(var prop in namesUsed){
        if(namesUsed[prop] == socket.id) {
          delete namesUsed[prop];
        }
      }

      io.sockets.in(currentRooms[socket.id]).emit("message", currentRooms[socket.id] + "#" +name + " has left the chat.");
    });
  });

  var joinRoom = function(socket, roomName) {
    if(currentRooms[socket.id]) {
      var fromRoom = currentRooms[socket.id];
      var users = io.sockets.clients(fromRoom);
      // io.sockets.in(fromRoom).emit("updateUsers", {users: users});
      io.sockets.in(currentRooms[socket.id]).emit("message", currentRooms[socket.id] + "#" +nicknames[socket.id] + " has left the room.");
      socket.leave(currentRooms[socket.id]);
    }

    roomName = roomName || "lobby";
    currentRooms[socket.id] = roomName;

    var toRoom = currentRooms[socket.id];
    var users = io.sockets.clients(toRoom);
    // io.sockets.in(toRoom).emit("updateUsers", {users: users});

    socket.join(roomName);
    io.sockets.in(currentRooms[socket.id]).emit("message", currentRooms[socket.id] + "#" +nicknames[socket.id] + " has joined room: "+ roomName + ".");
  }

}