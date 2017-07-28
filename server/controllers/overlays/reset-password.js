module.exports = function(req, res, next) {
  let token = req.flash('user.password.reset');
  if (!token)
    return res.render('overlays/error', {error: 'Geen geldige token, probeer het later opnieuw'});
  
  res.render('overlays/reset-password', { token: token });
};
