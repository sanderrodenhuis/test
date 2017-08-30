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
      order.job = res.locals.jobs.find(job => job.IdJob === order.IdJob);
      order.Amount = 1;
      if (order.AdditionalAnswers)
      {
        order.AdditionalAnswers.forEach(({Answer, IdAdditionalQuestion}) => {
          let question = order.job.AdditionalQuestions.find(question => question.IdAdditionalQuestion === IdAdditionalQuestion);
          if (! question || question.AnswerType !== 'Integer')
            return false;
          order.Amount = parseFloat(Answer);
          return true;
        });
      }
      
    });
    res.locals.orders = res.locals.orders.filter(order => order.job).sort((a,b) => Date.parse(a.FulfillmentDateTime) - Date.parse(b.FulfillmentDateTime));
    let pastOrders = res.locals.orders.filter(order => Date.parse(order.FulfillmentDateTime) < Date.now());
    let futureOrders = res.locals.orders.filter(order => Date.parse(order.FulfillmentDateTime) >= Date.now());
    res.locals.orders = futureOrders.concat(pastOrders);
    res.render('pages/account/overview');
  } catch(e) {
    throw new ApplicationError('Uw account overzicht kan momenteel niet worden geladen. Probeer het later opnieuw.');
  }
}));

module.exports = router;
