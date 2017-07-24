const router = require('express').Router();
const passport = require('passport');
const jsonWebToken = require('jsonwebtoken');
const fileUpload = require('../utils/file-upload');
const fs = require('fs');
const path = require('path');

router.post('/user/login',(req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.json({
        success: false,
        error: err.message
      });
    }
    
    const jwt = jsonWebToken.sign(
      {
        username: user.Username,
        firstname: user.FirstName,
        lastname: user.LastName,
        id: user.IdUser
      },
      process.env.JWT_SECRET,
      {issuer: process.env.JWT_ISSUER}
    );

    res.json({
      success: true,
      jwt: jwt
    });
  })(req, res, next);
});


router.post('/file/upload', fileUpload({ext: ['jpg','jpeg','gif','png']}), (req, res, next) => {
  const files = req.files.map(file => {
    const {filename, destination, originalname, path: oldPath} = file;
    const newPath = path.join(destination, [Date.now(),filename,originalname].join('__'));
    fs.renameSync(oldPath, newPath);
    return filename;
  });
  
  res.json({
    files
  });
});

module.exports = router;

