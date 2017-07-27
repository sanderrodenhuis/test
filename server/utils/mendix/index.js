const Api = require('./api');

module.exports = (app) => {
  app.use((req,res,next) => {
    req.mendix = new Api({app, res, req});
    next();
  })
};
