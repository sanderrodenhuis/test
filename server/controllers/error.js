module.exports = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  
  res.status(err.status || 500);
  if (req.accepts('json'))
  {
    res.send({error: err.message});
    return;
  }
  if (req.accepts('html'))
  {
    res.render('pages/error');
    return;
  }
  res.type('txt').send(err.message);
  
};
