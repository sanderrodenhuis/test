const Api = require('../../utils/api');

module.exports = async function(req, res, next) {
  try {
    const categories = await Api.fetchJobCategories();
    res.render('pages/overview', {categories});
  } catch (e) {
    console.log(e);
  }
};
