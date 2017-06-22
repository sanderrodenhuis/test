var Router = require('express').Router();

[
  'appointment-cancel',
  'appointment-edit-error',
  'login',
  'login--activate',
  'login--psw-forgotten',
  'login--psw-new',
  'task-details',
  'terms',
  'upload-error',
].forEach(overlay => {
  Router.get('/'+overlay, (req, res, next) => {
    res.render('overlays/'+overlay);
  });
});

module.exports = Router;
