const router = require('express').Router();
const passport = require('passport');
const fileUpload = require('../utils/file-upload');
const fs = require('fs');
const path = require('path');
const {createAuthToken, verifyPasswordResetToken} = require('../utils/helpers');

router.post('/user/login',(req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.json({
        success: false,
        error: err.message
      });
    }
    const jwt = createAuthToken(user);
    res.json({
      success: true,
      jwt: jwt
    });
  })(req, res, next);
});

router.post('/user/forgot-password',async (req, res, next) => {
  const email = req.body.email;//body check
  try{
    const response = await req.mendix.userForgotPassword(email);
  } catch(e) { }
  
  res.json({
    success: true
  });
});

router.post('/user/reset-password',async (req, res, next) => {
  try {
    const {token, NewPassword, ConfirmPassword} = req.body;
    let email = verifyPasswordResetToken(token);
    if (!token || !email)
      throw 'Geen geldige token ingevoerd';
    
    let verify = req.mendix.validators.editUserPassword({NewPassword, ConfirmPassword});
    if (verify)
      throw verify;
    
    let user;
    try {
      user = await req.mendix.fetchUserByEmail(email);
      if (!user)
        throw Error();
    } catch (e) {
      throw 'Opgegeven gebruiker bestaat niet';
    }
    
    user.NewPassword = NewPassword;
    user.ConfirmPassword = ConfirmPassword;
    try {
      await req.mendix.updateUser(user);
    } catch (e) {
      throw 'Er is iets misgegaan tijdens het opslaan van uw gegevens. Probeer het later opnieuw.'
    }
    
    res.json({
      success: true
    });
  } catch (error) {
    res.status(400).json({error});
  }
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

