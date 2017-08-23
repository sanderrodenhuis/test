const passport = require('passport'),
      pick = require('./helpers').pick;


const authenticate = (req, res, next) => {
  passport.authenticate('jwt', (err, user, error) => {
    if (user)
      res.locals.user = req.user = pick(user, 'Username','FirstName','LastName','IdUser');
    else if (error)
      req.error = error;
    next();
  })(req, res, next);
};

module.exports = authenticate;
