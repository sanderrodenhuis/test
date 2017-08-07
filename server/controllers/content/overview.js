let router = require('express').Router();

router.get('/', async (req, res, next) => {
  try {
    const categories = await req.mendix.fetchJobCategories();
    res.render('pages/overview', {categories});
  } catch (e) {
  }
});

router.get('/:IdJob-*', async (req,res,next) => {
  try {
    const categories = await req.mendix.fetchJobCategories();
    const job = await req.mendix.fetchJob(req.params.IdJob);
    
    res.locals.job = job;
    res.render('pages/overview', {categories});
  } catch (e) {
  }
});
module.exports = router;
