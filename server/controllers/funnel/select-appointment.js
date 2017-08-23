let router = require('express').Router();
let {pick} = require('../../utils/helpers');
let {HtmlHandler, JsonHandler, ApplicationError, ValidationError} = require('../../utils/errors');

router.get('/', HtmlHandler( async (req, res) =>{
  let order = res.locals.order = req.session.order = req.session.order || {};
  if (! order.IdJob)
    return res.redirect('/funnel');
  
  res.locals.job = await req.mendix.fetchJob(order.IdJob);
  if (req.user)
    res.locals.user = await req.mendix.fetchUser(req.user.IdUser);
  
  res.render('pages/funnel/select-appointment');
}));

router.post('/', JsonHandler( async (req, res) => {
  let postData = req.body;
  let order = res.locals.order = req.session.order = req.session.order || {};
  
  let newOrder = Object.assign({}, order, pick(postData,'HouseNumber','PostCode','Addition','Date','Times','Comments','Photos'));
  if (newOrder.Times)
    newOrder.Times = newOrder.Times.split('|');
  let validation = req.mendix.validators.newOrder(newOrder, 'HouseNumber','PostCode','IdJob','Date','Times');
  if (validation)
  {
    res.set('X-Redirect-To', '/funnel/');
    throw new ValidationError('Er is iets misgegaan. Probeer het later opnieuw',validation)
  }
  
  Object.assign(order, newOrder);
  if (order.Photos && ! Array.isArray(order.Photos))
    order.Photos = [order.Photos];
  
  return true;
}));

module.exports = router;
