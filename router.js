module.exports = function(req, res) {
  if(req.url == "/"){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
  }
  else {
    //Load file
  }
}