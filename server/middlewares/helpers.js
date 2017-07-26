module.exports = (app) => {
  app.use((req,res,next) => {
    let origUrl = req.originalUrl.substr(1).split('/');
    res.locals.isActivePage = (page) => {
      page = page.split('/').slice(0,origUrl.length);
      let url = origUrl.slice(0,page.length);
      return page.join('/') == url.join('/') ? ' is-active':'';
    };
    next();
  })
};
