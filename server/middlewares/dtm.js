module.exports = (app) => {
  app.use((req,res,next) => {
    if (process.env.DTM_URL)
      res.locals.DTM_URL = process.env.DTM_URL;
    next();
  });
};
