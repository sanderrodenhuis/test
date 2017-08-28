const router = require('express').Router(),
      {createAuthToken, verifyUserActivateToken} = require('../../utils/helpers'),
      {HtmlHandler, ValidationError} = require('../../utils/errors');


router.get('/', HtmlHandler( async function(req, res) {
  try
  {
    let {payload} = req.query;
    if (! payload)
      throw new Error();
    let data = verifyUserActivateToken(payload);
    let user = await req.mendix.fetchUser(data.u);
    user.IsActive = true;
    await req.mendix.updateUser(user.IdUser, user);
    res.locals.user = user;
    res.cookie('authorization', createAuthToken(user));
    res.render('pages/account/activate--complete');
  } catch (error) {
    throw new ValidationError('Geen geldige activatie-token opgegeven',{});
  }
}));

module.exports = router;

