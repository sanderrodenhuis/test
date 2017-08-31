const passportJwt = require('passport-jwt'),
      JwtStrategy = passportJwt.Strategy,
      JwtExtract = passportJwt.ExtractJwt;

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET || 'development.secret',
  issuer: process.env.JWT_ISSUER || 'development.issuer',
  jwtFromRequest: JwtExtract.fromExtractors([
    JwtExtract.fromUrlQueryParameter('authorization'),
    JwtExtract.fromAuthHeader(),
    (req) => (req && req.cookies) ? req.cookies['authorization'] : null
  ])
};

module.exports = (passport) => {
    done(null, user);
  }));
};
