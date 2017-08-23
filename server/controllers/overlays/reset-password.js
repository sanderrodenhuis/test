let router = require('express').Router();
let {HtmlHandler} = require('../../utils/errors');

router.get('/', HtmlHandler( async (req,res) => {
  try {
    let token = req.flash('user.password.reset');
    if (!token)
      throw Error();
    res.render('overlays/reset-password', {token: token});
  } catch (e) {
    return res.render('overlays/error', {error: 'Geen geldige token, probeer het later opnieuw'});
  }
}));

module.exports = router;
