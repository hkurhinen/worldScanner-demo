
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var config = require('./config');
var WorldScanner = require('worldscanner');
var worldScanner = new WorldScanner(config);

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended : true
}));

app.get('/', function(req, res){
  res.render('index');
});

io.on('connection', function(socket){
  socket.on('start:scan', function(data){
    console.log(data);
    worldScanner.scan(data.ne, data.sw, 1);
  });
});

worldScanner.on('error', function(err){
  console.log('Error occurred during scanning: '+err);
});

worldScanner.on('scannerPaused', function(resumes){
  console.log('Resuming scanning after: ' + resumes + 'ms');
});

worldScanner.on('scannerResumed', function(){
  console.log('Scanner resumed');
});

worldScanner.on('areaScanned', function(area){
  io.emit('area:scanned', area);
});

worldScanner.on('areaSplit', function(new_size){
  console.log('Venue limit hit, went down to size: '+new_size);
});

worldScanner.on('venueDiscovered', function(venue){
  io.emit('venue:found', venue);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});