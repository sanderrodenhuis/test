var router = require('express').Router();

router.get('/', function(req, res, next) {
  res.render('pages/funnel/confirmation');
});

// development stub
router.get('/logged-in', function(req, res, next) {
  res.render('pages/funnel/confirmation--logged-in');
});

module.exports = router;
