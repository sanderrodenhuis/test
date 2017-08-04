let router = require('express').Router();
let Path = require('path');
router.get('/', async (req, res, next) => {
  try {
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
      
      user = await req.mendix.createUser(order);
    }
    else {
      user = await req.mendix.fetchUser(req.user.IdUser);
    }
    res.locals.user = req.user = user;
    Object.assign(order, {IdClient: user.IdUser});
    let time = order.Times.split('|')[0];
    order.FulfillmentDateTime = order.Date + 'T' + time + ':00+0100';
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
  } catch (error) {
    res.render('pages/error',{error});
  }
});

// development stub
router.get('/logged-in', function(req, res, next) {
  res.render('pages/funnel/confirmation--logged-in');
});

module.exports = router;
