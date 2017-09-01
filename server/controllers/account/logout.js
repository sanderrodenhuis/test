const router = require('express').Router(),
      {createAuthToken, verifyUserActivateToken} = require('../../utils/helpers'),
      {HtmlHandler, ValidationError} = require('../../utils/errors');


router.get('/', HtmlHandler( async function(req, res) {
  res.clearCookie('authorization');
  res.redirect('/#modal=logout/confirmation')
}));

module.exports = router;

