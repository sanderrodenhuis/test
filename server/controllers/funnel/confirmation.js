let router = require('express').Router();
let {HtmlHandler, ApplicationError} = require('../../utils/errors');

let Path = require('path');
router.get('/', HtmlHandler( async (req,res) => {
  let order = req.session.order = req.session.order || {};
  if (!order.IdJob)
    return res.redirect('/funnel');
  if (!order.Date || !order.Times)
    return res.redirect('/funnel/maak-een-afspraak');
  order = Object.assign({}, order);
  
  let user;
  if (!req.user) {
    let errors = req.mendix.validators.newUser(order);
    if (errors)
      return res.redirect('/funnel/contact-gegevens');
    
    try
    {
      user = await req.mendix.createUser(order);
    } catch (e) {
      throw new ApplicationError('Gebruiker kon niet worden aangemaakt. Probeer het later opnieuw.');
    }
  }
  else {
    try
    {
      user = await req.mendix.fetchUser(req.user.IdUser);
    } catch (e) {
      throw new ApplicationError('Gebruiker kon niet worden geverifieerd. Probeer het later opnieuw.');
    }
  }
  res.locals.user = req.user = user;
  Object.assign(order, {IdClient: user.IdUser});
  let time = order.Times[0];
  order.FulfillmentDateTime = order.Date + 'T' + time + ':00+0100';
  order.AdditionalAnswers = Object.entries(order.AdditionalQuestions || {}).map(([key,value]) => ({
    IdAdditionalQuestion: key,
    Answer: value
  }));
  let newOrder = await req.mendix.createOrder(order);
  const uploadPath = Path.join(process.cwd(), './upload');
  if (order.Photos && order.Photos.length)
  {
    await Promise.all(order.Photos.map(async (filename) => {
      return await req.mendix.createOrderPhoto(newOrder.IdOrder, Path.join(uploadPath,filename));
    }));
  }
  order.IdOrder = newOrder.IdOrder;
  res.locals.order = order;
  res.locals.job = await req.mendix.fetchJob(order.IdJob);
  req.app.mail.send(user.Email, 'Afspraak bevestiging', 'emails/appointment/confirmation', {
    job: res.locals.job,
    user: user,
    order: order
  });
  req.session.order = {};
  res.render('pages/funnel/confirmation');
}));

// development stub
router.get('/', HtmlHandler( async (req,res) => {
  res.render('pages/funnel/confirmation--logged-in');
}));

module.exports = router;
