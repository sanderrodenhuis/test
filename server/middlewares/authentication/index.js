const passport = require('passport');

require('./local')(passport);
require('./jwt')(passport);

module.exports = (app) => {
  app.use(passport.initialize());
};
