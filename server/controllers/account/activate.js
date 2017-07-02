var router = require('express').Router();

router.get('/', function(req, res, next) {
  res.render('pages/account/activate');
});

// development stub
router.get('/complete', function(req, res, next) {
  res.render('pages/account/activation-complete');
});

module.exports = router;

