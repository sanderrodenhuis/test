const router = require('express').Router();

router.use('/', require('./overview'));
router.use('/inschrijven', require('./create'));
router.use('/reset-password', require('./reset-password'));

router.use('/wijzigen', require('./edit'));
router.use('/activeren', require('./activate'));
router.use('/afspraak/wijzigen', require('./appointment/edit'));
router.use('/afspraak/feedback', require('./appointment/feedback'));

router.use('/uitloggen', require('./logout'));
module.exports = router;
