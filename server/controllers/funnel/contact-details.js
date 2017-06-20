var router = require('express').Router();

router.get('/', function(req, res, next) {
  res.render('pages/funnel/contact-details');
});

// development stub
router.get('/logged-in', function(req, res, next) {
  res.render('pages/funnel/contact-details--logged-in');
});

module.exports = router;
