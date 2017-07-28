module.exports = function(req, res, next) {
  const {payload} = req.query;
  if (! payload)
    throw Error('Geen geldige token mee ingevoerd');

  req.flash('user.password.reset', req.query.payload);
  res.redirect('/#modal=reset-password');
};
