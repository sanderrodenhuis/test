let router = require('express').Router();
let {HtmlHandler} = require('../../utils/errors');

router.get('/', HtmlHandler( async (req,res) => {
  res.render('pages/subscriptions');
}));

module.exports = router;
