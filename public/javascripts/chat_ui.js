ChatUI = function($rootEl, chat){
  this.$rootEl = $rootEl;
  this.$rootEl.find("form.message-input-form").on("submit", this.getMessage.bind(this));
  this.chat = chat;
}

ChatUI.prototype.getMessage = function(event) {
  event.preventDefault();
  var formData = $(event.currentTarget).serializeJSON();

  if(formData.message[0] == '/') {
    this.chat.processCommand(formData.message);
  }
  else {
    this.sendMessage(formData.message);
  }
}

ChatUI.prototype.sendMessage = function(message) {
  this.chat.sendMessage(message);
}

