const router = require('express').Router();
const passport = require('passport');
const fileUpload = require('../utils/file-upload');
const fs = require('fs');
const path = require('path');
const {createAuthToken, verifyPasswordResetToken, generatePassword} = require('../utils/helpers');

const {
  JsonHandler,
  HttpError,
  ValidationError,
  AuthenticationError,
  ApplicationError
} = require('../utils/errors');

router.post('/admin/user/create', JsonHandler( async (req,res) => {
  let user;
  try
  {
    let IdUser = req.body.IdUser;
    user = await req.mendix.fetchUser(IdUser);
    
  } catch(e) {
    throw new ApplicationError('Could not fetch user');  }
  
  let password = generatePassword();
  
  user.NewPassword = user.ConfirmPassword = password;
  try
  {
    await req.mendix.updateUser(user.IdUser, user);
  } catch(e) {
    throw new ApplicationError('Could not update user');
  }
  
  req.app.mail.send(user.Email, 'Nieuwe gebruiker', 'emails/admin/account/create', { user });
  
  return true;
}));

router.post('/user/login',JsonHandler(async (...args) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        return reject(new AuthenticationError("Gebruikersnaam/Wachtwoord komen niet overeen"));
      }
      
      const jwt = createAuthToken(user);
      return resolve({jwt});
    })(...args);
  });
}));

router.post('/user/forgot-password',JsonHandler(async (req, res) => {
  const email = req.body.email;
  if (email)
    await req.mendix.userForgotPassword(email).catch(() => true); // even when we fail, we report it as a success
  return true;
}));

router.post('/user/reset-password',JsonHandler( async (req, res, next) => {
  const {token, NewPassword, ConfirmPassword} = req.body;
  let email = verifyPasswordResetToken(token);
  if (!token || !email)
    throw new HttpError(400, 'Geen geldige token ingevoerd');
  
  let verify = req.mendix.validators.editUserPassword({NewPassword, ConfirmPassword});
  if (verify)
    throw new ValidationError('Ongeldige aanvraag', verify);
  
  let user;
  try {
    user = await req.mendix.fetchUserByEmail(email);
    if (!user)
      throw new Error();
  } catch (e) {
    throw new AuthenticationError('Opgegeven gebruiker bestaat niet');
  }
  
  user.NewPassword = NewPassword;
  user.ConfirmPassword = ConfirmPassword;
  try {
    await req.mendix.updateUser(user);
  } catch (e) {
    throw new ApplicationError('Er is iets misgegaan tijdens het opslaan van uw gegevens. Probeer het later opnieuw.');
  }
} ));


router.post('/file/upload', JsonHandler(fileUpload({ext: ['jpg','jpeg','gif','png']}), false), JsonHandler( async (req) => {
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
  
  return {files};
}));

router.get('/availability', JsonHandler( async (req,res) => {
  let order = req.session.order = req.session.order || {};
  if (! order.IdJob)
    return res.redirect('/funnel');
  
  let data = req.query,
      validation = {};
  if (! data.Date || String(data.Date).split('-').length !== 3 )
    validation.Date = 'Ongeldige datum';
  if (! data.HouseNumber)
    validation.HouseNumber = 'Ongeldig huisnummer opgegeven';
  if (! data.PostCode)
    validation.PostCode = 'Ongeldige postcode opgegeven';
  
  if (Object.keys(validation).length)
    throw new ValidationError('Ongeldige aanvraag', validation);
  
  data.IdJob = order.IdJob;
  try
  {
    let result = await req.mendix.fetchTimeslots(data.IdJob, data.Date, data.PostCode, data.HouseNumber, data.Addition);
    let fnParseTime = (time) => time.split('T')[1].split(':').slice(0,2).join(':');
    let timeSlots = result.map(row => ({
      from: fnParseTime(row.TimeSlotFrom),
      until: fnParseTime(row.TimeSlotUntil),
      id: row.IdTimeSlot
    }));
    return timeSlots;
  } catch (e) {
    throw new ApplicationError('Er is iets misgegaan tijdens het opvragen van de beschikbare tijden. Probeer het later opnieuw.');
  }
  
} ));
module.exports = router;

