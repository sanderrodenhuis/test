const router = require('express').Router();
const {HtmlHandler, ApplicationError} = require('../../utils/errors');

router.get('/', HtmlHandler( async (req, res) => {
  if (! req.user)
    return res.redirect('/#modal=login');
  
  try {
    res.locals.user = await req.mendix.fetchUser(req.user.IdUser);
    res.locals.jobs = await req.mendix.fetchJobs();
    res.locals.orders = await req.mendix.fetchOrdersByUser(req.user.IdUser);

    res.locals.orders.forEach(order => {
      order.job = res.locals.jobs.find(job => job.IdJob === order.IdJob)
    });

    res.locals.orders = res.locals.orders.filter(order => order.job);
    res.render('pages/account/overview');
  } catch(e) {
    throw ApplicationError('Uw account overzicht kan momenteel niet worden geladen. Probeer het later opnieuw.');
  }
  
}));

module.exports = router;
