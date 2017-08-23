const router = require('express').Router();
const {HtmlHandler, JsonHandler, ValidationError,ApplicationError} = require('../../utils/errors');


router.get('/', HtmlHandler( async (req, res) => {
  if (! req.user)
    return res.redirect('/#modal=login');
  
  res.locals.user = await req.mendix.fetchUser(req.user.IdUser);
  res.render('pages/account/edit');
}));

router.post('/', JsonHandler( async (req, res) => {
  if (! req.user)
    return res.redirect('/#modal=login');
  
  const postData = Object.assign({},req.body,{
    IsCustomer: !!req.body.IsCustomer,
    HasSubscription: !!req.body.HasSubscription
  });
  
  let validation = req.mendix.validators.editUser(postData);
  
  if (postData.NewPassword)
    validation = Object.assign({}, validation, req.mendix.validators.editUserPassword(postData));
  
  if (postData.HasSubscription && !postData.IsCustomer)
    validation = Object.assign({}, validation, {IsCustomer: ['U dient akkoord te gaan met de machtiging']});
  
  if (Object.keys(validation || {}).length)
    throw new ValidationError('Geen geldige gebruikersgegevens ingevoerd', validation);
  
  try
  {
    await req.mendix.updateUser(req.user.IdUser, postData);
  } catch(e) {
    throw new ApplicationError('Er is iets misgegaan bij het updaten van uw account. Probeer het later opnieuw.');
  }
  
  return true;
}));

module.exports = router;
