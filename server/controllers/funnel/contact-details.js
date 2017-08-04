let router = require('express').Router();
let {pick} = require('../../utils/helpers');

router.get('/', async (req, res, next) => {
  let order = res.locals.order = req.session.order = req.session.order || {};
  if (! order.IdJob)
    return res.redirect('/funnel');
  if (!order.Date || !order.Times)
    return res.redirect('/funnel/maak-een-afspraak');
  
  res.locals.job = await req.mendix.fetchJob(order.IdJob);
  
  if (req.user)
  {
    res.locals.user = req.user = await req.mendix.fetchUser(req.user.IdUser);
    return res.render('pages/funnel/contact-details--logged-in');
  }
  
  else
  {
    res.render('pages/funnel/contact-details');
  }
});
router.post('/', async (req, res, next) => {
  try {
    let order = res.locals.order = req.session.order = req.session.order || {};
    if (! order.IdJob)
      return res.status(400).json({
        error: 'Er is iets fout gegaan. Probeer het later opnieuw',
        redirect: '/funnel/'
      });
    if (!order.Date || !order.Times)
      return res.status(400).json({
        error: 'Er is iets fout gegaan. Probeer het later opnieuw',
        redirect: '/funnel/maak-een-afspraak'
      });
    
    const postData = Object.assign({
      Street: 'extendThroughApi',
      City: 'extendThroughApi',
      IsActive: false
    }, req.body, {
      IsCustomer: !!req.body.IsCustomer,
      HasSubscription: !!req.body.HasSubscription,
      HasConfirmed: !!req.body.HasConfirmed,
      Username: req.body.Email
    });
    
    let errors = req.mendix.validators.newUser(postData);
    
    if (req.body.HasSubscription && ! req.body.IsCustomer)
      errors = Object.assign({}, errors, {IsCustomer: ['U dient akkoord te gaan met de machtiging']});
    if (! req.body.HasConfirmed)
      errors = Object.assign({}, errors, {HasConfirmed: ['U dient akkoord te gaan met de algemene voorwaarden']});
    
    if (Object.keys(errors || {}).length)
      return res.status(400).json({
        error: errors
      });
    
    Object.assign(
      order,
      pick(postData, 'FirstName','LastName','Email','Username','PhoneNumber','NewPassword','ConfirmPassword','IsCustomer','HasSubscription', 'IBAN','IsActive','Street','City')
    );
    return res.json({
      success: true
    });
  } catch (error) {
    res.status(400);
    return res.json({
      error: error.message || error
    });
  }
});

// development stub
router.get('/logged-in', function(req, res, next) {
  res.render('pages/funnel/contact-details--logged-in');
});
router.get('/wijzigen', async (req,res,next) => {
  if (! req.user)
    return res.redirect('/funnel/contact-gegevens');
});
module.exports = router;
