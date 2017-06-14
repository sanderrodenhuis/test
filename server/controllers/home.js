var router = require('express').Router();
var passport = require('passport');

router.get('/', (req, res) => {
  res.render('pages/home');
});


module.exports = router;
