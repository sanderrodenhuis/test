let router = require('express').Router();

router.get('/', async (req, res, next) => {
  res.locals.order = req.session.order = {};
  try {
    const categories = await req.mendix.fetchJobCategories();
    res.render('pages/funnel/select-task', {
      categories
    });
  } catch(e ) { console.log(e); }
});
router.post('/', async (req, res, next) => {
  let {IdJob} = req.body;
  if (! IdJob)
    return res.redirect('/funnel');
  
  req.session.order.IdJob = req.body.IdJob;
  res.redirect('/funnel/maak-een-afspraak');
});

module.exports = router;
