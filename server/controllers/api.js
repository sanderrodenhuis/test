const router = require('express').Router();
const passport = require('passport');
const fileUpload = require('../utils/file-upload');
const fs = require('fs');
const path = require('path');
const {createAuthToken} = require('../utils/helpers');

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

router.post('/user/forgot-password/update',async (req, res, next) => {

  try{
    const { token, NewPassword, ConfirmPassword } = req;
    const {e} = jsonWebToken.verify(token, process.env.JWT_SECRET);
    emailExists = req.mendix.userEmailExists(e);
    if (!emailExists){
      throw {Email: 'TODO email doesn\' exists' };
    }
const user = fetchUser(e);
user.NewPassword=NewPassword;
user.ConfirmPassword=ConfirmPassword;
    const response = await req.mendix.updateUser(user);
    res.json({
      success: response
    });
  }catch(err){
    res.json({
      success: false
    });
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

