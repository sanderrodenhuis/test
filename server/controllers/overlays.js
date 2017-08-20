var Router = require('express').Router();

const createHandler = (template) => {
  return (req, res, next) => res.render('overlays/' + template);
};


Router.get('/login', createHandler('login'));
Router.get('/forgot-password', createHandler('forgot-password'));
Router.get('/forgot-password/complete', createHandler('forgot-password--complete'));

Router.get('/reset-password',require('./overlays/reset-password'));
Router.get('/reset-password/complete',createHandler('reset-password--complete'));


Router.get('/appointment-cancel/:IdOrder', createHandler('appointment-cancel'));
Router.get('/appointment-edit-error', createHandler('appointment-edit-error'));
Router.get('/login--activate', createHandler('login--activate'));
Router.get('/klus-informatie/:jobId/:action?', require('./overlays/job-information'));
Router.get('/terms', createHandler('terms'));
Router.get('/privacy', createHandler('privacy'));
Router.get('/colofon', createHandler('colofon'));
Router.get('/error', createHandler('error'));
Router.get('/upload-error', createHandler('upload-error'));

module.exports = Router;
