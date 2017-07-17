const Api = require('../../utils/api');

module.exports = async function(req, res, next) {
  try {
    console.log('no its not');
    const categories = await Api.fetchJobCategories();
    res.render('pages/account/wijzigen', {categories});
  } catch (e) {
    console.log(e);
  }
};
