const router = require('express').Router();
const passport = require('passport');
const fileUpload = require('../utils/file-upload');
const fs = require('fs');
const path = require('path');
const {createAuthToken, verifyPasswordResetToken, postCode} = require('../utils/helpers');

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
    const newFilename = [Date.now(),originalname].join('__');
    const newPath = path.join(destination, newFilename);
    fs.renameSync(oldPath, newPath);
    return newFilename;
  }).map(filename => ({
    path: '/uploads/',
    filename: filename
  }));
  
  res.json(files);
});

router.get('/availability', async (req,res,next) => {
  let order = req.session.order = req.session.order || {};
  if (! order.IdJob)
    return res.redirect('/funnel');
//  return res.json([]);
  let data = req.query;
  if (! data.Date || String(data.Date).split('-').length !== 3 )
    return res.status(400).json({error: 'Incorrect date'});
  if (! data.HouseNumber)
    return res.status(400).json({error: 'No housenumber given'});
  if (! data.PostCode)
    return res.status(400).json({error: 'No postcode given'});
  
  data.IdJob = order.IdJob;
  let result = await req.mendix.fetchTimeslots(data.IdJob, data.Date, data.PostCode, data.HouseNumber, data.Addition);
  let fnParseTime = (time) => time.split('T')[1].split(':').slice(0,2).join(':');
  let timeSlots = result.map(row => ({
    from: fnParseTime(row.TimeSlotFrom),
    until: fnParseTime(row.TimeSlotUntil),
  }));
  res.json(timeSlots);
})
module.exports = router;

