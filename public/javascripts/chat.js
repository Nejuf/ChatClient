
Chat = function (socket) {
 this.socket = socket;
 this.socket.on("message", function(data){
   Chat.displayMessage(data);
 });

 this.socket.on("updateUsers", function(data) {
   Chat.updateUsers(data.users);
 });
}

Chat.prototype.sendMessage = function(message){
  // this.socket.emit("message", { text: message });
  this.socket.emit("new_message", message);
  $("textarea.message").val("");
}

Chat.displayMessage = function(message) {
  $("div.messages ul").append("<li>" + message + "</li>");
}

Chat.updateUsers = function(userList) {
  $("div.users ul").empty();
  var listText = "";
  userList.forEach(function(userItem){
    listText += "<li>" + userItem + "</li>"
  });
  $("div.users ul").append(listText);
}

Chat.prototype.processCommand = function(commandString) {

  if(commandString.substr(1,4) == "nick") {
    this.socket.emit("nicknameChangeRequest", commandString.substr(6, commandString.length-1));
    $("textarea.message").val("");
  }
  else if(commandString.substr(1,4) == "join") {
    this.socket.emit("roomChangeRequest", commandString.substr(6, commandString.length-1));
    $("textarea.message").val("");
  }
  else {
    console.log("Error, invalid command");
    Chat.displayMessage( "Invalid/unrecognized command: " + commandString );
  }
}