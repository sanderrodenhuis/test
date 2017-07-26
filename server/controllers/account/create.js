var router = require('express').Router();

router.get('/', function(req, res, next) {
  res.render('pages/account/create');
});
router.post('/', function(req, res, next) {
  console.log('post',req.body);
  res.render('pages/account/create');
});

module.exports = router;

