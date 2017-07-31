const router = require('express').Router();


router.get('/',async (req, res, next) => {
  if (! req.user)
    return res.redirect('/#modal=login');
  
  res.locals.user = await req.mendix.fetchUser(req.user.IdUser);
  res.render('pages/account/edit');
});

router.post('/', async (req, res, next) => {
  if (! req.user)
    return res.redirect('/#modal=login');
  
  try {
  
    const postData = Object.assign({},req.body,{
      IsCustomer: !!req.body.IsCustomer,
      HasSubscription: !!req.body.HasSubscription
    });
    
    let errors = req.mendix.validators.editUser(postData);
    
    if (postData.NewPassword)
      errors = Object.assign({}, errors, req.mendix.validators.editUserPassword(postData));
    
    if (postData.HasSubscription && !postData.IsCustomer)
      errors = Object.assign({}, errors, {IsCustomer: ['U dient akkoord te gaan met de machtiging']});
  
    if (Object.keys(errors || {}).length)
      throw errors;
    
    let result = await req.mendix.updateUser(req.user.IdUser, postData);
    
    return res.json({
      success: true
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || error
    });
  }
});

module.exports = router;
