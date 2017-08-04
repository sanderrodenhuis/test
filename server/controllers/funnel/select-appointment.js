let router = require('express').Router();
let {pick} = require('../../utils/helpers');

router.get('/', async (req, res, next) =>{
  let order = res.locals.order = req.session.order = req.session.order || {};
  if (! order.IdJob)
    return res.redirect('/funnel');
  res.locals.job = await req.mendix.fetchJob(order.IdJob);
  
  if (req.user)
    res.locals.user = await req.mendix.fetchUser(req.user.IdUser);
  
  res.render('pages/funnel/select-appointment');
});
router.post('/', async (req, res, next) => {
  let postData = req.body;
  let order = res.locals.order = req.session.order = req.session.order || {};
  if (! order.IdJob)
    return res.status(400).json({error: 'Er is iets misgegaan. Probeer het later opnieuw of begin opnieuw.'})
  
  if (! postData.HouseNumber || ! postData.PostCode)
    return res.status(400).json({error: 'Er een geldig adres en postcode in.'});
  
  if (! postData.Date || ! postData.Times)
    return res.status(400).json({error: 'Er is geen datum+tijd geselecteerd.'});
  
  Object.assign(order, pick(postData,'HouseNumber','PostCode','Addition','Date','Times','Comments','Photos'));
  if (order.Photos && ! Array.isArray(order.Photos))
    order.Photos = [order.Photos];
  
  res.json({success: true});
});

module.exports = router;
