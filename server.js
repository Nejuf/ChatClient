var http = require('http');
var router = require('./router.js');
var chat_server = require('./lib/chat_server.js')

var server = http.createServer(router).listen(8080);
chat_server.createChat(server);

console.log('Server running at http://127.0.0.1:8080/');