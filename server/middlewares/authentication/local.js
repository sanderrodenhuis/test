const LocalStrategy = require('passport-local').Strategy;

const USER = {username: 'martijn', password: 'test'};

module.exports = (passport) => {
  passport.use(new LocalStrategy({session: false}, (username, password, done) => {
    if (USER.username !== username)
      return done(new Error('Username does not exist', false));
    if (USER.password !== password)
      return done(new Error('Password is incorrect', false));
    
    return done(null, {username});
  }));
};
