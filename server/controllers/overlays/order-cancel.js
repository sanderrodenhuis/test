let router = require('express').Router({mergeParams: true});
let {HtmlHandler} = require('../../utils/errors');

router.get('/', HtmlHandler( async (req,res) => {
  try {
    if (! req.params.IdOrder)
      throw new Error();
    
    let order = await req.mendix.fetchOrder(req.params.IdOrder);
    res.locals.order = order;
    
    let date = Date.parse(order.FulfillmentDateTime),
        dateDiff = (date - Date.now()) / 1000;
    if (dateDiff >= 24*60*60) {
      res.render('overlays/order-cancel');
    } else if (dateDiff >= 2*60*60) {
      res.render('overlays/order-cancel-warning');
    } else {
      res.render('overlays/order-cancel-error');
    }
  } catch (e) {
    res.render('overlays/error', {error: 'Er is iets misgegaan, probeer het later opnieuw.'});
  }
}));

module.exports = router;
