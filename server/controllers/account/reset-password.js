const router = require('express').Router();
const {HtmlHandler, ValidationError} = require('../../utils/errors');

router.get('/', HtmlHandler( async (req, res) => {
  const {payload} = req.query;
  if (! payload)
    throw new ValidationError('Geen geldige token ingegeven.',{});

  req.flash('user.password.reset', req.query.payload);
  res.redirect('/#modal=reset-password');
}));

module.exports = router;
