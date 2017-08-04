module.exports = async (req, res, next) => {
  try {
    if (! req.params.jobId)
      throw Error();
    
    let job = await req.mendix.fetchJob(req.params.jobId);
    res.render('overlays/task-details', {
      job,
      HasAction: req.params.action
    });
  } catch (e) {
    res.render('overlays/error', {error: 'Er is iets misgegaan, probeer het later opnieuw.'});
  }
};
