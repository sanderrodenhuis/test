const LocalStrategy = require('passport-local').Strategy;
const api = require('../../utils/api');

module.exports = (passport) => {
  passport.use(new LocalStrategy({session: false}, async (username, password, done) => {
    let emailExists = await api.userEmailExists(username);
    
//    if (! emailExists)
//      return done(new Error('Username does not exist', false));
    
    let user = await api.userLogin(username, password);
    
    if (! user)
      return done(new Error('Password is incorrect', false));
    
    
    return done(null, user);
  }));
};
