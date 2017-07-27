module.exports = async function(req, res, next) {
  try {
    const categories = await req.mendix.fetchJobCategories();
    res.render('pages/funnel/select-task', {
      categories
    });

  } catch(e ) { console.log(e); }

};
