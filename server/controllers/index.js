var express = require('express'),
    router = express.Router(),
    authenticate = require('../utils/authenticate');

router.use(authenticate);

router.use('/',require('./content'));
router.use('/account', require('./account'));
router.use('/overlays', require('./overlays'));
router.use('/api', require('./api'));
router.use('/funnel', require('./funnel'));

router.use(require('./error'));



module.exports = router;
