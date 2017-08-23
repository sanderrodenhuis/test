let router = require('express').Router({mergeParams: true});
let {HtmlHandler} = require('../../utils/errors');

router.get('/', HtmlHandler( async (req,res) => {
  try {
    if (! req.params.IdOrder)
      throw Error();
    
    let order = await req.mendix.fetchOrder(req.params.IdOrder);
    res.render('overlays/appointment-cancel', {
      IdOrder: req.params.IdOrder
    });
  } catch (e) {
    res.render('overlays/error', {error: 'Er is iets misgegaan, probeer het later opnieuw.'});
  }
}));

module.exports = router;
