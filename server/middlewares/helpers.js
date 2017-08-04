const helpers = require('../utils/helpers');
module.exports = (app) => {
  
  app.use((req,res,next) => {
    app.locals.PostCode = helpers.postCode;
    app.locals.Currency = helpers.currency;
    app.locals.LocaleDate = helpers.localeDate;
    app.locals.LocaleTime = helpers.localeTime;
    
    let origUrl = req.originalUrl.substr(1).split('/');
    res.locals.isActivePage = (page) => {
      page = page.split('/').slice(0,origUrl.length);
      let url = origUrl.slice(0,page.length);
      return page.join('/') == url.join('/') ? ' is-active':'';
    };
    next();
  })
};
