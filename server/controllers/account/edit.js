module.exports = async function(req, res, next) {
  if (! req.user)
    return res.redirect('/#modal=login');
  
  res.locals.user = await req.mendix.fetchUser(req.user.IdUser);
  res.render('pages/account/edit');
};
