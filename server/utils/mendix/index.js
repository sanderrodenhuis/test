const Api = require('./api');

module.exports = (app) => {
  app.use((req,res,next) => {
    res.mendix = new Api({app, res, req});
    next();
  })
};
