module.exports = async function(req, res, next) {
  if (! req.user)
    return res.redirect('/#modal=login');

  res.locals.user = await req.mendix.fetchUser(req.user.IdUser);
  res.locals.jobs = await req.mendix.fetchJobs();
  res.locals.orders = await req.mendix.fetchOrdersByUser(req.user.IdUser)
  res.locals.orders.forEach(order => {
    order.job = res.locals.jobs.find(job => job.IdJob === order.IdJob)
  });
  res.render('pages/account/overview');
};
