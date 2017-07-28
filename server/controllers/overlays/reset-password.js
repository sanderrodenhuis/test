module.exports = function(req, res, next) {
  let token = req.flash('user.password.reset');
  res.render('overlays/reset-password', { token: token });
};
