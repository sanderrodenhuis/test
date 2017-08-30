const JsonHandler = (fn, handleSuccess = true) => (req, res, next) => {
  new Promise((resolve, reject) => {
    let prms = fn(req,res,(err,data) => {
      if (err)
        return reject(err);
      resolve(data);
    });
    if (prms && prms.then)
      prms.then(resolve).catch(reject);
  }).then(response => {
    if (! handleSuccess)
      return next(null, response);
    
    if (res.headersSent)
      return res.end();
    if (response === true || ! response)
      return res.json({success: true});
    return res.json(response);
  }).catch(error => {
    res.status(error.status || 500);
    res.json(Object.assign({
      error: error.constructor.name,
      message: error.message
    },error));
    res.end();
  });
};

const HtmlHandler = fn => (req, res, next) => {
  fn(req,res,next)
    .then(() => {
    })
    .catch(error => {
      res.status(error.status || 500);
      res.render('pages/error', {error});
    });
};

class HttpError extends Error
{
  constructor(status, message)
  {
    super(message);
    this.status = status;
  }
}

class ValidationError extends HttpError {
  constructor(message, fields)
  {
    super(400, message);
    this.fields = fields;
  }
}

class AuthenticationError extends HttpError {
  constructor(message)
  {
    super(401, message);
  }
}

class ApplicationError extends HttpError {
  constructor(message)
  {
    super(500,message);
  }
}

module.exports = {
  JsonHandler,
  HtmlHandler,
  
  HttpError,
  ValidationError,
  AuthenticationError,
  ApplicationError
};
