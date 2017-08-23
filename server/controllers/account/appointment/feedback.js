const router = require('express').Router();
const {HtmlHandler} = require('../../../utils/errors');

router.get('/', HtmlHandler( async (req, res) => {
  res.render('pages/account/appointment/feedback');
}));

module.exports = router;
