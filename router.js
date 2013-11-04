var fs = require('fs');

module.exports = function(req, res) {
  var url = req.url
  if(url == "/"){
    url = "/public/index.html";
  }

  fs.readFile("."+url, { encoding: "utf8" }, function(error, data) {
    if(error) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end("File not found.");
    }
    else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    }
  });
}