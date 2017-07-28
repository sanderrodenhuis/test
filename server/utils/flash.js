const flash = function (key, value) {
  if (! this.session)
    throw Error('req.flash(...) requires sessions');
  let data = this.session.__flash = this.session.__flash || {};
  if (value) {
    data[key] = value;
  } else {
    let result = data[key];
    delete data[key];
    return result;
  }
};

module.exports = (app) => {
  app.use((req, res, next) => {
    req.flash = flash;
    next();
  });
};
