let router = require('express').Router();
let {HtmlHandler, ApplicationError} = require('../../utils/errors');

router.get('/', HtmlHandler( async (req,res) => {
  try {
    const categories = await req.mendix.fetchJobCategories();
    res.render('pages/overview', {categories});
  } catch (e) {
    throw new ApplicationError('Er is iets misgegaan bij het ophalen van ons aanbod. Probeer het later opnieuw');
  }
}));

router.get('/:IdJob-*', HtmlHandler( async (req,res) => {
  try {
    const categories = await req.mendix.fetchJobCategories();
    const job = await req.mendix.fetchJob(req.params.IdJob);
    res.locals.job = job;
    res.render('pages/overview', {categories});
  } catch (e) {
    throw new ApplicationError('Er is iets misgegaan bij het ophalen van ons aanbod. Probeer het later opnieuw');
  }
}));

module.exports = router;
