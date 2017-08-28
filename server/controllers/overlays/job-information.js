let router = require('express').Router({mergeParams: true});
let {HtmlHandler} = require('../../utils/errors');

router.get('/', HtmlHandler( async (req,res) => {
  try {
    if (! req.params.jobId)
      throw new Error();
    
    let job = await req.mendix.fetchJob(req.params.jobId);
    res.render('overlays/task-details', {
      job,
      HasAction: req.params.action
    });
  } catch (e) {
    res.render('overlays/error', {error: 'Er is iets misgegaan, probeer het later opnieuw.'});
  }
}));

module.exports = router;
