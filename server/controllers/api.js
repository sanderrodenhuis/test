const router = require('express').Router();
const passport = require('passport');
const jsonWebToken = require('jsonwebtoken');

router.post('/user/login',(req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.json({
        success: false,
        error: err.message
      });
    }
    
    const jwt = jsonWebToken.sign(
      {username: user.username},
      process.env.JWT_SECRET,
      {issuer: process.env.JWT_ISSUER}
    );

    res.json({
      success: true,
      jwt: jwt
    });
  })(req, res, next);
});

module.exports = router;

