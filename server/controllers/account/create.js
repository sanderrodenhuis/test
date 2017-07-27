const router = require('express').Router();


router.get('/', function(req, res, next) {
  res.render('pages/account/create');
});
router.get('/voltooid', function(req, res, next) {
  let email = req.flash('user.create.email');
  res.render('pages/account/create--complete',{
    email
  });
});
router.post('/', async function(req, res, next) {
  try {
    const postData = Object.assign({
      Street: 'extendThroughApi',
      City: 'extendThroughApi',
      IsActive: false
    }, req.body, {
      IsCustomer: !!req.body.IsCustomer,
      HasSubscription: !!req.body.HasSubscription,
      HasConfirmed: !!req.body.HasConfirmed,
      Username: req.body.Email,
    });
    
    let errors = req.mendix.validators.newUser(postData);
    
    if (req.body.HasSubscription && ! req.body.IsCustomer)
      errors = Object.assign({}, errors, {IsCustomer: ['U dient akkoord te gaan met de machtiging']});
    if (! req.body.HasConfirmed)
      errors = Object.assign({}, errors, {HasConfirmed: ['U dient akkoord te gaan met de algemene voorwaarden']});

    if (errors)
      throw(errors);
    
    await req.mendix.createUser(postData);
    req.flash('user.create.email', postData.Email)
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

module.exports = router;

