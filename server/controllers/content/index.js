const router = require('express').Router();

router.use('/',require('./home'));
router.use('/over-zo-opgelost',require('./about'));
router.use('/spoedgevallen',require('./emergency'));
router.use('/ons-klusaanbod',require('./overview'));
router.use('/onze-abonnementen',require('./subscriptions'));
router.use('/contact',require('./contact'));

module.exports = router;
