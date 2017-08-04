const router = require('express').Router(),
      {createAuthToken, verifyUserActivateToken} = require('../../utils/helpers');

router.get('/', async function(req, res, next) {
  try
  {
    let {payload} = req.query;
    if (! payload)
      throw Error();
    let data = verifyUserActivateToken(payload);
    let user = await req.mendix.fetchUser(data.u);
    user.IsActive = true;
    await req.mendix.updateUser(user.IdUser, user);
    res.locals.user = user;
    res.cookie('authorization', createAuthToken(user));
    
    res.render('pages/account/activate--complete');
  } catch (error) {
    res.render('pages/error', {error: Error('geen geldige activatie-token opgegegeven')});
    throw Error('geen geldige activatie-token opgegegeven');
  }
});

module.exports = router;

