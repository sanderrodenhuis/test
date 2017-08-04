require('dotenv').config();

const express = require('express');
const path = require('path');

const engine = require('ejs-mate');
const http = require('http');

const app = express();

app.set('views', path.join(__dirname,'../client/templates'));
app.set('view engine', 'ejs');
app.engine('ejs', engine);

app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets')));
app.use('/uploads', express.static(path.join(__dirname, '../upload')));

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
