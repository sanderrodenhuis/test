var Router = require('express').Router();

const createHandler = (template) => {
  return (req, res, next) => res.render('overlays/' + template);
};


Router.get('/login', createHandler('login'));
Router.get('/forgot-password', createHandler('forgot-password'));
Router.get('/forgot-password/complete', createHandler('forgot-password--complete'));

Router.use('/reset-password',require('./reset-password'));
Router.get('/reset-password/complete',createHandler('reset-password--complete'));


Router.use('/appointment-cancel/:IdOrder', require('./appointment-cancel'));
Router.get('/appointment-edit-error', createHandler('appointment-edit-error'));
Router.get('/login--activate', createHandler('login--activate'));
Router.use('/klus-informatie/:jobId/:action?', require('./job-information'));
Router.get('/terms', createHandler('terms'));
Router.get('/privacy', createHandler('privacy'));
Router.get('/colofon', createHandler('colofon'));
Router.get('/error', createHandler('error'));
Router.get('/upload-error', createHandler('upload-error'));

module.exports = Router;
