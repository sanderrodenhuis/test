var passport = require('passport'),
    passportJwt = require('passport-jwt'),
    jwtStrategy = passportJwt.Strategy,
    jwtExtract = passportJwt.ExtractJwt;

var jwtOptions = {
  secretOrKey: process.env.JWT_SECRET || 'development.secret',
  issuer: process.env.JWT_ISSUER || 'development.issuer',
  jwtFromRequest: jwtExtract.fromExtractors([
    jwtExtract.fromHeader('Authorization'),
    jwtExtract.fromUrlQueryParameter('Authorization'),
    jwtExtract.fromAuthHeader,
    (req) => (req && req.cookies) ? req.cookies['jwt'] : null
  ])
};

passport.use(new jwtStrategy(jwtOptions, (payload, done) => {
  console.log('Authentication payload', payload);
  
  done(null, false);
}));

module.exports = (app) => {
  app.use(passport.initialize());
};
