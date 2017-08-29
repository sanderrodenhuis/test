let router = require('express').Router();
let {pick} = require('../../utils/helpers');
let {HtmlHandler, JsonHandler, ApplicationError, ValidationError} = require('../../utils/errors');

router.get('/', HtmlHandler( async (req, res, next) => {
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
}));

router.post('/', JsonHandler( async (req, res, next) => {
  let order = res.locals.order = req.session.order = req.session.order || {};
  if (! order.IdJob)
  {
    res.set('X-Redirect-To', '/funnel/');
    throw new ApplicationError('Er is iets misgegaan. Probeer het later opnieuw');
  }
  if (!order.Date || !order.Times)
  {
    res.set('X-Redirect-To', '/funnel/maak-een-afspraak')
    throw new ApplicationError('Er is iets misgegaan. Probeer het later opnieuw');
  }
  
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
  if (await req.mendix.userEmailExists(postData.Username))
    errors = Object.assign({}, errors, {Email: ['Dit emailadres is al in gebruik']});
  if (Object.keys(errors || {}).length)
  {
    throw new ValidationError('Incorrecte velden', errors);
  }
  
  Object.assign(
    order,
    pick(postData, 'FirstName','LastName','Email','Username','PhoneNumber','NewPassword','ConfirmPassword','IsCustomer','HasSubscription', 'IBAN','IsActive','Street','City')
  );
  return true;
}));

module.exports = router;
