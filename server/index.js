require('dotenv').config();

var express = require('express');
var path = require('path');

var engine = require('ejs-mate');
var http = require('http');


var app = express();

app.set('views', path.join(__dirname,'../client/templates'));
app.set('view engine', 'ejs');
app.engine('ejs', engine);

app.use(express.static(path.join(__dirname, '../client/dist')));

require('./middlewares')(app);

app.use(require('./controllers'));

app.set('port', process.env.PORT || 3000);

var server = http.createServer(app);

server.listen(app.get('port'));

server.on('error',(error)=>{
  console.log(error);
});

server.on('listening',() => {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
});
