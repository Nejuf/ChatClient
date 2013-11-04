var http = require('http');
var router = require('./router.js');

http.createServer(router).listen(8080);

console.log('Server running at http://127.0.0.1:8080/');