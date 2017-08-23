const router = require('express').Router();

router.use('/', require('./select-task'));
router.use('/kies-een-klus', require('./select-task'));
router.use('/maak-een-afspraak', require('./select-appointment'));
router.use('/contact-gegevens', require('./contact-details'));
router.use('/bevestigen', require('./confirmation'));

module.exports = router;
