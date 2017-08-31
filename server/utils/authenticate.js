const passport = require('passport'),
      pick = require('./helpers').pick;


const authenticate = (req, res, next) => {
  passport.authenticate('jwt', async (err, user, error) => {
    if (user)
    {
      try {
        res.locals.user = req.user = await req.mendix.fetchUser(user.IdUser);
      } catch (e) {
        res.clearCookie('authorization');
      }
    }
    if (error)
      req.error = error;
    next();
  })(req, res, next);
};

module.exports = authenticate;
