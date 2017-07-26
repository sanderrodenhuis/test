const LocalStrategy = require('passport-local').Strategy;

module.exports = (passport) => {
  passport.use(new LocalStrategy({session: false, passReqToCallback: true}, async (req, username, password, done) => {
    let user = await req.app.mendix.userLogin(username, password);
    if (! user)
      return done(new Error('Password is incorrect', false));
    
    
    return done(null, user);
  }));
};
