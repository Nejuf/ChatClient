
Chat = function (socket) {
 this.socket = socket;
 this.socket.on("message", function(data){
   Chat.displayMessage(data);
 })
}

Chat.prototype.sendMessage = function(message){
  // this.socket.emit("message", { text: message });
  this.socket.emit("new_message", message);
}

Chat.displayMessage = function(message) {
  $("div.messages ul").append("<li>" + message + "</li>");
  $("textarea.message").val("");
}