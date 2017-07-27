module.exports = function(req, res, next) {
  console.log('token',req.query.payload);
  // req.flash('user.password.reset', req.query.payload);
  res.redirect('/#modal=reset-password');
};
