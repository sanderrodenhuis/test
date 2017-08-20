module.exports = async (req, res, next) => {
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
};
