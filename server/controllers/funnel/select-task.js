let router = require('express').Router();
let {HtmlHandler, ApplicationError} = require('../../utils/errors');

router.get('/', HtmlHandler( async (req, res) => {
  res.locals.order = req.session.order = {};
  try {
    const categories = await req.mendix.fetchJobCategories();
    res.render('pages/funnel/select-task', {
      categories
    });
  } catch(e ) {
    throw new ApplicationError('Er is iets misgegaan. Probeer het later opnieuw.');
  }
}));

router.post('/', HtmlHandler( async (req, res) => {
  let {IdJob} = req.body;
  if (! IdJob)
    return res.redirect('/funnel');

  res.locals.order = req.session.order = {IdJob};
  res.redirect('/funnel/maak-een-afspraak');
}));

module.exports = router;
