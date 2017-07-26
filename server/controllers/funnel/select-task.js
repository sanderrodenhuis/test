module.exports = async function(req, res, next) {
  try {
    const categories = await res.mendix.fetchJobCategories();
    res.render('pages/funnel/select-task', {
      categories
    });

  } catch(e ) { console.log(e); }

};
