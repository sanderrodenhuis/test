const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


module.exports = function(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  
  require('./authentication')(app);
  require('./session')(app);
  require('./helpers')(app);
  require('../utils/mail')(app);
  require('../utils/mendix')(app);
  
  require('./debug')(app);
};
