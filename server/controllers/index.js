var express = require('express'),
    router = express.Router(),
    account = express.Router(),
    funnel = express.Router(),
    passport = require('passport'),
    pick = require('../utils/helpers').pick;

const authenticate = (req, res, next) => {
  passport.authenticate('jwt', (err, user, error) => {
    if (user)
      res.locals.user = req.user = pick(user, 'Username','FirstName','LastName','IdUser');
    else if (error)
      req.error = error;
    next();
  })(req, res, next);
};
router.use(authenticate);

// in development we have multiple routes getting returned for stateful templates so this is USE instead of GET
// TODO: remove those later and integrate in the templates
router.get('/',require('./content/home'));
router.get('/over-zo-opgelost',require('./content/about'));
router.get('/spoedgevallen',require('./content/emergency'));
router.get('/ons-klusaanbod',require('./content/overview'));
router.get('/onze-abonnementen',require('./content/subscriptions'));

router.use('/account', account);
account.get('/', require('./account/overview'));
account.use('/inschrijven', require('./account/create'));
account.use('/reset-password', require('./account/reset-password'));

account.get('/wijzigen', require('./account/edit'));
// TODO: change use to get and make a single route
account.use('/activeren', authenticate, require('./account/activate'));
account.get('/afspraak/wijzigen', require('./account/appointment/edit'));
account.get('/afspraak/feedback', require('./account/appointment/feedback'));

router.use('/funnel', funnel);
funnel.get('/', require('./funnel/select-task'));
funnel.get('/kies-een-klus', require('./funnel/select-task'));
funnel.get('/maak-een-afspraak', require('./funnel/select-appointment'));

// TODO: change use to get and make a single route
funnel.use('/contact-gegevens', require('./funnel/contact-details'));
// TODO: change use to get and make a single route
funnel.use('/bevestigen', require('./funnel/confirmation'));

// router for the overlays
router.use('/overlays', require('./overlays'));

// router for the asynchronous calls
router.use('/api', require('./api'));

// error handler
router.use(require('./error'));



module.exports = router;
