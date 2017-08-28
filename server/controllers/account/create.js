const router = require('express').Router();
const {HtmlHandler, JsonHandler, ValidationError} = require('../../utils/errors');

router.get('/', HtmlHandler( async (req, res, next) => {
  res.render('pages/account/create',{
    HasSubscription: req.query.type !== 'basic'
  });
}));

router.get('/voltooid', HtmlHandler( async (req, res, next) => {
  let email = req.flash('user.create.email');
  if (! email)
    throw new ApplicationError('Deze pagina is verlopen.');
  
  res.render('pages/account/create--complete',{
    email
  });
}));

router.post('/', JsonHandler( async function(req, res, next) {
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
  
  let validation = req.mendix.validators.newUser(postData);
  
  if (req.body.HasSubscription && ! req.body.IsCustomer)
    validation = Object.assign({}, validation, {IsCustomer: ['U dient akkoord te gaan met de machtiging']});
  if (! req.body.HasConfirmed)
    validation = Object.assign({}, validation, {HasConfirmed: ['U dient akkoord te gaan met de algemene voorwaarden']});
  
  if (Object.keys(validation || {}).length)
    throw new ValidationError('Geen geldige gebruikersgegevens ingevoerd', validation);
  
  await req.mendix.createUser(postData);
  req.flash('user.create.email', postData.Email)
  return true;
}));

module.exports = router;

